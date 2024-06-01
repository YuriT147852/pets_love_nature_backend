import { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import OrderModel from '@/models/orders';
import { successResponse } from '@/utils/successHandler';
import CustomerModel from '@/models/customer';
import Joi from 'joi';
import * as payment from '@/utils/payment';

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

interface PaymentItem {
    Email: string;
    Amt: number; //總金額
    ItemDesc: string; //商品描述
    aesEncrypt?: string;
    shaEncrypt?: string;
}

const schema = Joi.object({
    Email: Joi.string().email().required().messages({
        'string.base': 'Email 應該是字符串',
        'string.email': 'Email 格式無效',
        'any.required': 'Email 是必需的'
    }),
    Amt: Joi.number().required().messages({
        'number.base': 'Amt 應該是數字',
        'any.required': 'Amt 是必需的'
    }),
    ItemDesc: Joi.string().required().messages({
        'string.base': 'ItemDesc 應該是字符串',
        'any.required': 'ItemDesc 是必需的'
    })
}).options({ convert: false }); //禁用自動轉換

const { MerchantID, Version, PayGateWay, NotifyUrl, ReturnUrl } = process.env;

export const usePayment: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const item = req.body as PaymentItem;

    const { error } = schema.validate(item);

    //schema
    if (error) {
        next(errorResponse(400, 'body參數錯誤: ' + error.details.map(detail => detail.message).join(', ')));
        return;
    }

    //先新增一筆訂單

    //需要一個時間戳
    const TimeStamp = Math.round(new Date().getTime() / 1000);

    const order = {
        ...item, //訂單資料
        TimeStamp, //需要一個時間戳
        MerchantOrderNo: `${TimeStamp}` //這個要放mongo內的訂單編號
    };

    // 進行訂單加密
    // 加密第一段字串，此段主要是提供交易內容給予藍新金流
    const aesEncrypt = payment.createSesEncrypt(order);

    // 使用 HASH 再次 SHA 加密字串，作為驗證使用
    const shaEncrypt = payment.createShaEncrypt(aesEncrypt);
    order.aesEncrypt = aesEncrypt;
    order.shaEncrypt = shaEncrypt;

    const submitData = {
        PayGateWay,
        Version,
        order,
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
