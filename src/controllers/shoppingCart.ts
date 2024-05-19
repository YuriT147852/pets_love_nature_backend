/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { RequestHandler } from 'express';
import shoppingCartModel from '@/models/shoppingCart';
import {errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';

export const getCartById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    console.log('getShoppingCartById');
    console.log('req.params.id', req.params.id);

    const result = await shoppingCartModel
        .findOne({
            customerId: req.params.id
        })
        .populate({
            path: 'shoppingCart.productSpec',
            select: 'productNumber weight price inStock onlineStatus',
            populate: {
                path: "productId",
                select: '_id title productNumber imageGallery'
            }
        });


        // const collateResultArr = result?.shoppingCart.map(eachProduct => {

        //     // const product = eachProduct.productSpec.productId;
            
        //     const obj = {
        //         // product, ...eachProduct
        //     }
        //     return obj
        // })

        // .populate({
        //     path: 'shoppingCart.productId',
        //     select: '_id title productNumber imageGallery',
        // })
        // .populate({
        //     path: 'shoppingCart.productSpec',
        //     select: 'productNumber weight price inStock onlineStatus'
        // });


    if (!result) {
        next(errorResponse(404, "此customer id不存在"));
        return;
    }

    res.status(200).json(
        successResponse({
            message: '取得購物車資料成功',
            data: result,
        }),
    );
});



export const addCart: RequestHandler = handleErrorAsync(async(req, res, _next) => {

    console.log('req.body', req.body);
    console.log('addCart');

    const customerId = req.body.customerId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const addIsChoosedCart = req.body.shoppingCart.map((eachCart: object) => {
        const obj:object = {
            ...eachCart,
            isChoosed: false
        }
        console.log('obj', obj);
        return obj
    })

    console.log('addIsChoosedCart', addIsChoosedCart);
    const addCartFu = await shoppingCartModel.create({
        customerId,
        shoppingCart: addIsChoosedCart
    })

    res.status(200).json({
        message: '成功',
        data: addCartFu
    });
})