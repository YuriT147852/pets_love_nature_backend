import type { RequestHandler } from 'express';
import shoppingCartModel from '@/models/shoppingCart';
import {errorResponse, handleErrorAsync } from '@/utils/errorHandler';

export const getCartById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    console.log('getShoppingCartById');
    console.log('req.params.id', req.params.id);

    const result = await shoppingCartModel
        .findOne({
            customerId: req.params.id
        })
        .populate({
            path: 'shoppingCart.productId',
            select: '_id title productNumber imageGallery'
        })
        .populate({
            path: 'shoppingCart.productSpec',
            select: 'productNumber weight price inStock onlineStatus'
        });


    if (!result) {
        next(errorResponse(404, "此customer id不存在"));
        return;
    }

    res.send({
        status: true,
        data: result
    });
});