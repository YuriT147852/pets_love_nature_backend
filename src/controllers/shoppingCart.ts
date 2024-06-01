/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { RequestHandler } from 'express';
import shoppingCartModel from '@/models/shoppingCart';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import ProductSpecModel from '@/models/productSpec';

export const getCartById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const result = await shoppingCartModel
        .findOne({
            customerId: req.params.id
        })
        .populate({
            path: 'shoppingCart.productSpec',
            select: 'productNumber weight price inStock onlineStatus',
            populate: {
                path: 'productId',
                select: '_id title productNumber imageGallery'
            }
        });
    if (!result) {
        next(errorResponse(404, '此customer id不存在'));
        return;
    }

    res.status(200).json(
        successResponse({
            message: '取得購物車資料成功',
            data: result
        })
    );
});

export const getCartNoLogin: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    const shoppingCartArr = [];
    for (let i = 0; i < req.body.shoppingCart.length; i++) {
        const result = await ProductSpecModel.findById(req.body.shoppingCart[i].productSpec).populate({
            path: 'productId',
            select: 'title subtitle description star category otherInfo imageGallery'
        });
        const obj = {
            productSpec: result,
            quantity: req.body.shoppingCart[i].quantity
        };
        shoppingCartArr.push(obj);
    }

    const returnObj = {
        shoppingCart: shoppingCartArr
    };

    res.status(200).json(
        successResponse({
            message: '成功',
            data: returnObj
        })
    );
});

export const addCart: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    const { customerId, shoppingCart, addWay } = req.body;
    const customerData = await shoppingCartModel.findOne({
        customerId: customerId
    });

    // 如果購物車資料庫沒有該使用者
    if (!customerData) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const addIsChoosedCart = shoppingCart.map((eachCart: object) => {
            const obj: object = {
                ...eachCart,
                isChoosed: false
            };
            return obj;
        });

        const addCartFu = await shoppingCartModel.create({
            customerId,
            shoppingCart: addIsChoosedCart
        });

        res.status(200).json(
            successResponse({
                message: '成功',
                data: addCartFu
            })
        );
    } else {
        // 如果有該使用者，則更新購物車

        for (let i = 0; i < shoppingCart.length; i++) {
            let findStatus = false;
            for (let j = 0; j < customerData.shoppingCart.length; j++) {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                if (shoppingCart[i].productSpec === customerData.shoppingCart[j].productSpec.toString()) {
                    findStatus = true;
                    if (addWay === 0) {
                        // 加數量 用於除了購物車以外的介面
                        customerData.shoppingCart[j].quantity += shoppingCart[i].quantity;
                    } else if (addWay === 1) {
                        // 調整數量 用於購物車介面
                        customerData.shoppingCart[j].quantity = shoppingCart[i].quantity;
                    }
                }
            }

            if (!findStatus) {
                const targetDetail = shoppingCart[0];
                const obj = {
                    isChoosed: false,
                    productSpec: targetDetail.productSpec,
                    quantity: targetDetail.quantity
                };
                customerData.shoppingCart.push(obj);
            }
        }
        await customerData.save(); // 更新

        res.status(200).json(
            successResponse({
                message: '成功',
                data: customerData.shoppingCart
            })
        );
    }
});

export const deleteCart: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { customerId, productSpec } = req.body;
    const customerData = await shoppingCartModel.findOne({
        customerId: customerId
    });

    if (!customerData) {
        // 無此使用者
        next(errorResponse(400, '無此使用者'));
        return;
    } else {
        // 有此使用者
        for (let j = 0; j < customerData.shoppingCart.length; j++) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            if (productSpec === customerData.shoppingCart[j].productSpec.toString()) {
                // 加數量 用於除了購物車以外的介面
                customerData.shoppingCart.splice(j, 1);
            }
        }
    }

    await customerData.save();

    res.status(200).json(
        successResponse({
            message: '成功',
            data: '刪除成功'
        })
    );
    // }
});
