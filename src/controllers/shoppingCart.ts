/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { RequestHandler } from 'express';
import shoppingCartModel, { IAddShoppingCart } from '@/models/shoppingCart';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import ProductSpecModel from '@/models/productSpec';

// 用於檢查商品庫存數量和購物車數量
const checkInStock = async (productSpecArr: Array<IAddShoppingCart>) => {
    const tempArr = [];
    let str = '成功';

    for (let i = 0; i < productSpecArr.length; i++) {
        const focusSpec = productSpecArr[i].productSpec;
        const focusQuantity = productSpecArr[i].quantity;
        const result = await ProductSpecModel.findById(focusSpec).populate({
            path: 'productId',
            select: 'title subtitle description star category otherInfo imageGallery'
        });

        if (result?.inStock) {
            if (focusQuantity > result?.inStock) {
                // 如果數量大於instock
                const obj = {
                    productSpec: focusSpec,
                    quantity: result?.inStock,
                    message: '購物車數量大於庫存數量，已調整為庫存數量',
                    status: 1 // 0為正常 1為超過
                };
                str = '購物車內有商品數量大於庫存數量，已調整為庫存數量';
                tempArr.push(obj);
            } else {
                // 如果數量沒有大於instock
                const obj = {
                    productSpec: focusSpec,
                    quantity: focusQuantity,
                    message: '',
                    status: 0 // 0為正常 1為超過
                };
                tempArr.push(obj);
            }
        }
    }
    const obj = {
        checkedInStock: tempArr,
        checkedString: str
    };
    return obj;
};

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
        const focusSpec = req.body.shoppingCart[i];
        const result = await ProductSpecModel.findById(focusSpec.productSpec).populate({
            path: 'productId',
            select: 'title subtitle description star category otherInfo imageGallery'
        });
        if (result?.inStock) {
            const obj = {
                productSpec: result,
                quantity: focusSpec.quantity > result?.inStock ? result?.inStock : focusSpec.quantity
            };
            shoppingCartArr.push(obj);
        }
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-floating-promises
        const { checkedInStock, checkedString } = await checkInStock(shoppingCart);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const addIsChoosedCart = shoppingCart.map((eachCart: object) => {
            const obj: object = {
                ...eachCart,
                isChoosed: false
            };
            return obj;
        });

        await shoppingCartModel.create({
            customerId,
            shoppingCart: addIsChoosedCart
        });
        res.status(200).json(
            successResponse({
                message: checkedString,
                data: checkedInStock
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
                const targetDetail = shoppingCart[i];
                const obj = {
                    isChoosed: false,
                    productSpec: targetDetail.productSpec,
                    quantity: targetDetail.quantity
                };
                customerData.shoppingCart.push(obj);
            }
        }
        const tempCart = customerData.shoppingCart.map(eachCart => {
            const obj = {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                productSpec: eachCart.productSpec.toString(),
                quantity: eachCart.quantity
            };
            return obj;
        });

        const { checkedInStock, checkedString } = await checkInStock(tempCart);
        for (let i = 0; i < customerData.shoppingCart.length; i++) {
            for (let j = 0; j < checkInStock.length; j++) {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                if (checkedInStock[j].productSpec === customerData.shoppingCart[i].productSpec.toString())
                    customerData.shoppingCart[i].quantity = checkedInStock[i].quantity;
            }
        }

        await customerData.save(); // 更新

        res.status(200).json(
            successResponse({
                message: checkedString,
                data: checkedInStock
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
