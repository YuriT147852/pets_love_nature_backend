import { RequestHandler } from 'express';
import { handleErrorAsync } from '@/utils/handleError';
import OrderModel from '@/models/orders';
import { AppError } from '@/service/AppError';

export const getOrdersList: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    const result = await OrderModel.find(
        {
            userId: req.params.userid
        },
        { _id: true, orderDate: true, deliveryDate: true, orderAmount: true, orderStatus: true }
    );
    if (result.length === 0) {
        _next(AppError('消費者訂單不存在', 404));
        return;
    }
    res.status(200).json({
        message: '成功',
        result
    });
});

export const getOrders: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    const result = await OrderModel.find({
        _id: req.params.orderid
    });
    console.log(req.params.orderid);
    if (result.length === 0) {
        _next(AppError('該訂單資訊不存在', 404));
        return;
    }
    res.status(200).json({
        message: '成功',
        result
    });
});
