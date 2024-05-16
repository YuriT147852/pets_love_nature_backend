import { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import OrderModel from '@/models/orders';


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
    res.status(200).json({
        message: '成功',
        data: result
    });
});

export const getOrders: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const result = await OrderModel.find({
        _id: req.params.orderId
    });
    if (result.length === 0) {
        next(errorResponse(404, '該訂單資訊不存在'));
        return;
    }
    res.status(200).json({
        message: '成功',
        data: result
    });
});
