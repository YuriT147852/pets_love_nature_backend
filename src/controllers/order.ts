import { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import OrderModel from '@/models/orders';
import { successResponse } from '@/utils/successHandler';
import CustomerModel from '@/models/customer';
import * as payment from '@/utils/payment';
import { PaymentItem, ResPaymentItem } from '@/types/order';

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
            .populate({ path: 'userId', select: 'email' })
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
            .populate({ path: 'userId', select: 'email' })
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

        const OrderResult = await OrderModel.find({ _id: filterHandler }, { _id: true, orderStatus: true }).populate({
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
        orderStatus: 1,
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

    console.log(result);
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
