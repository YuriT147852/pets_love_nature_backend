import { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import OrderModel from '@/models/orders';
import { successResponse } from '@/utils/successHandler';
import CustomerModel from '@/models/customer';
import * as payment from '@/utils/payment';
import { PaymentItem, ResPaymentItem } from '@/types/order';
import { PaymentResponse } from '@/types/payment';
import OpenAI from 'openai';
import shoppingCartModel from '@/models/shoppingCart';
import { Customer } from '@/models/customer';

export const getOrdersList: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const result = await OrderModel.find(
        {
            userId: req.params.userId
        },
        { _id: true, orderDate: true, deliveryDate: true, orderAmount: true, orderStatus: true }
    );
    if (result.length === 0) {
        next(errorResponse(404, '消費者訂單不存在'));
        return;
    }
    res.status(200).json(
        successResponse({
            message: '取得消費者訂單成功',
            data: result
        })
    );
});

export const getOrders: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const result = await OrderModel.find({
        _id: req.params.orderId
    });
    if (result.length === 0) {
        next(errorResponse(404, '該訂單資訊不存在'));
        return;
    }
    res.status(200).json(
        successResponse({
            message: '取得訂單資訊成功',
            data: result
        })
    );
});

export const getOrdersByAdmin: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { page, filterStatus, searchText, requestSame, searchType } = req.query;

    if (!page) {
        next(errorResponse(404, 'page 為必填'));
        return;
    }

    //filterStatus格式必須為1或是0
    if (filterStatus && filterStatus != '1' && filterStatus != '0') {
        next(errorResponse(400, 'filterStatus 參數格式錯誤'));
        return;
    }

    if (searchText || requestSame || searchType) {
        if (!searchText || !requestSame || !searchType) {
            next(errorResponse(400, '搜尋參數格式錯誤'));
            return;
        }

        if (searchType !== 'email' && searchType !== 'orderNum') {
            next(errorResponse(400, 'searchType格式錯誤'));
            return;
        }
    }

    //每頁5筆
    const pageSize = 5;
    //大小排序
    const filter = filterStatus === '1' ? 1 : -1;
    const skip = (Number(page) - 1) * pageSize;

    // 獲取總頁數
    const totalDocuments = await OrderModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / pageSize);

    //不需要文字搜
    if (!searchText) {
        const result = await OrderModel.find({}, { _id: true, orderStatus: true })
            .sort({ orderStatus: filter })
            .populate<{ userId: Customer }>({ path: 'userId', select: 'email' })
            .skip(skip)
            .limit(pageSize);

        const resData = {
            OrderData: result.map(item => ({
                _id: item['_id'],
                userId: item['userId'].id,
                email: item['userId'].email,
                orderStatus: item.orderStatus
            })),
            page: {
                nowPage: page,
                totalPages
            }
        };

        res.status(200).json(
            successResponse({
                message: '成功抓取訂單資訊',
                data: resData
            })
        );
    }

    enum Direction {
        RegexFilter = '0',
        AllFiler = '1'
    }

    const text: string = searchText as string;
    //模糊搜
    const regex = new RegExp(text);
    const filterRegex = { $regex: regex };
    const filterHandler = requestSame === Direction.AllFiler ? searchText : filterRegex;

    //搜尋為email
    if (searchType === 'email') {
        const result = await CustomerModel.find({ email: filterHandler });
        // console.log(result);

        if (result.length === 0) {
            const resData = {
                OrderData: [],
                page: {
                    nowPage: page,
                    totalPages: 0
                }
            };

            res.status(200).json(
                successResponse({
                    message: '成功抓取訂單資訊',
                    data: resData
                })
            );
        }

        const formatResult = result.map(item => ({ userId: item['_id'] }));

        const totalDocuments = await OrderModel.find(
            { $or: formatResult },
            { _id: true, orderStatus: true }
        ).countDocuments();

        const totalPages = Math.ceil(totalDocuments / pageSize);

        const OrderResult = await OrderModel.find({ $or: formatResult }, { _id: true, orderStatus: true })
            .sort({ orderStatus: filter })
            .populate<{ userId: Customer }>({ path: 'userId', select: 'email' })
            .skip(skip)
            .limit(pageSize);

        const resData = {
            OrderData: OrderResult.map(item => ({
                _id: item['_id'],
                userId: item['userId'].id,
                email: item['userId'].email,
                orderStatus: item.orderStatus
            })),
            page: {
                nowPage: page,
                totalPages
            }
        };

        res.status(200).json(
            successResponse({
                message: '成功抓取訂單資訊',
                data: resData
            })
        );

        //搜尋訂單號
    } else if (searchType === 'orderNum') {
        if (requestSame === '0') {
            next(errorResponse(400, 'orderNum沒支援模糊搜尋'));
            return;
        }

        const OrderResult = await OrderModel.find({ _id: filterHandler }, { _id: true, orderStatus: true }).populate<{
            userId: Customer;
        }>({
            path: 'userId',
            select: 'email'
        });

        const resData = {
            OrderData: OrderResult.map(item => ({
                _id: item['_id'],
                userId: item['userId'].id,
                email: item['userId'].email,
                orderStatus: item.orderStatus
            }))
        };

        res.status(200).json(
            successResponse({
                message: '成功抓取訂單資訊',
                data: resData
            })
        );
    }
});

const { MerchantID, Version, PayGateWay, NotifyUrl, ReturnUrl } = process.env;

export const usePayment: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const item = req.body as PaymentItem;

    const { Email, Amt, ItemDesc, userId, orderProductList, deliveryAddress, deliveryUserName } = item;

    if (!Email || !Amt || !ItemDesc || !userId || !orderProductList || !deliveryAddress || !deliveryUserName) {
        next(errorResponse(400, 'body參數錯誤'));
        return;
    } else if (orderProductList.length === 0) {
        next(errorResponse(400, 'orderProductList長度不能為0'));
        return;
    }

    //新增一筆訂單
    const resultOrder = await OrderModel.create({
        userId,
        orderProductList,
        deliveryAddress,
        orderStatus: -3,
        deliveryUserName
    });

    //需要一個時間戳
    const TimeStamp = Math.round(new Date().getTime() / 1000);

    const order = {
        ...item, //訂單資料
        TimeStamp, //需要一個時間戳
        MerchantOrderNo: resultOrder._id //這個要放mongo內的訂單編號
    };

    // 進行訂單加密
    const aesEncrypt = payment.createSesEncrypt(order);

    // 使用 HASH 再次 SHA 加密字串，作為驗證使用
    const shaEncrypt = payment.createShaEncrypt(aesEncrypt);

    const ResOrder = {
        ...order,
        aesEncrypt: aesEncrypt,
        shaEncrypt: shaEncrypt
    };

    const submitData: ResPaymentItem = {
        PayGateWay,
        Version,
        ResOrder,
        MerchantID,
        NotifyUrl,
        ReturnUrl
    };

    res.status(200).json(
        successResponse({
            message: '成功抓取金流資訊',
            data: submitData
        })
    );
});

export const PaymentNotify: RequestHandler = handleErrorAsync(async (req, res, next) => {
    console.log('req body notify data', req.body);

    const response = req.body as PaymentResponse;

    //解密交易內容
    const data = payment.createSesDecrypt(response.TradeInfo);
    console.log('data', data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const orderId = data?.Result?.MerchantOrderNo;
    console.log('orderId', orderId);
    //找是否有這個訂單
    const result = await OrderModel.findOne({ _id: orderId });

    console.log('result', result);

    if (!result) {
        console.log('無訂單資料');
        next(errorResponse(404, '無訂單資料'));
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (data.Status !== 'SUCCESS') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log('訂單失敗', data?.Result?.Status);
        next(errorResponse(404, '訂單失敗'));
        return;
    }

    //成功就更新狀態
    await OrderModel.updateOne({ _id: orderId }, { orderStatus: 1 });

    //先抓
    const userId = result.userId;

    //把購物車裡shoppingCart是TRUE刪掉
    await shoppingCartModel.updateMany({ customerId: userId }, { $pull: { shoppingCart: { isChoosed: true } } });

    res.status(200).json(
        successResponse({
            message: '成功抓取金流資訊',
            data: '成功'
        })
    );
});

export const editOrderStatus: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { orderId, orderStatus }: { orderId: string; orderStatus: number } = req.body;

    if (!orderId || !orderStatus) {
        next(errorResponse(400, 'body參數錯誤'));
        return;
    }

    const result = await OrderModel.findByIdAndUpdate(
        orderId,
        { orderStatus },
        {
            new: true, //返回更新
            runValidators: true // 更新時自動驗證
        }
    );

    if (!result) {
        next(errorResponse(400, '找不到該id'));
        return;
    }

    res.status(200).json(
        successResponse({
            message: '更新成功'
        })
    );
});

export const getOrderById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { orderID } = req.params;

    const result = await OrderModel.find({
        _id: orderID
    }).populate({ path: 'userId', select: 'email' });

    if (!result) {
        next(errorResponse(404, '無訂單資料'));
        return;
    }

    res.status(200).json(
        successResponse({
            message: '取得消費者訂單成功',
            data: result
        })
    );
});

export const getAiText: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const text = req.query.text as string;

    if (!text) {
        next(errorResponse(404, 'text參數錯誤'));
        return;
    }

    const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: [
            {
                // 環境與規則
                role: 'system',
                content: '你是一個電商賣家,賣各種寵物食品,需要生成文案'
            },
            {
                // 代表用戶輸入,問題
                role: 'user',
                content: text
            },
            {
                // 預期的助手回答
                role: 'assistant',
                content: '好的，請稍等，我將生成一段關於這個產品的文案。'
            },
            {
                // 代表用戶進一步輸入或確認
                role: 'user',
                content: '好的，麻煩你了。'
            }
        ],
        // 限制最大長度
        // max_tokens: 150,
        // 0~1 越大隨機性越大
        temperature: 0.7,
        // 生成概率質量
        top_p: 0.9,
        // 重複度
        frequency_penalty: 0,
        // 新穎度
        presence_penalty: 0.6
    });

    const ResText = chatCompletion.choices[0].message.content;
    const AiText = ResText ? ResText.trim() : '';

    res.status(200).json(
        successResponse({
            message: '文案取得成功',
            data: AiText
        })
    );
});
