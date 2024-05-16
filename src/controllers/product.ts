import type { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import ProductModel from '@/models/product';
import ProductSpecModel from '@/models/productSpec';

export const getProductList: RequestHandler = handleErrorAsync(async (_req, res, next) => {
    const result = await ProductSpecModel.find({}).populate({
        path: 'productId',
        select: 'title subtitle description star category otherInfo imageGallery'
    });
    if (result.length === 0) {
        next(errorResponse(404, '無商品資料'));
        return;
    }
    res.status(200).json(
        successResponse({
            message: '取得商品資料成功',
            data: result,
        }),
    );

});

export const getProductById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const result = await ProductSpecModel.findOne({
        _id: req.params.id
    }).populate({
        path: 'productId',
        select: 'title subtitle description star category otherInfo imageGallery'
    });

    if (!result) {
        next(errorResponse(404, '無商品資料'));
        return;
    }

    res.status(200).json(
        successResponse({
            message: '取得單一商品資料成功',
            data: result,
        }),
    );
});


export const createOneOrder: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    // TODO: 未完成 1.欄位 2.SPEC若有多種須加上迴圈
    // 1.先建立商品訊息
    const { title, subtitle, productNumber, weight, price, inStock } = req.body;
    const resultProduct = await ProductModel.create({
        title,
        subtitle
    });
    const productId = await resultProduct._id;

    // 2.建立商品規格
    const resultProductSpec = await ProductSpecModel.create({
        productId,
        productNumber,
        weight,
        price,
        inStock
    });

    await resultProductSpec.populate({
        path: 'productId'
    });
    res.status(200).json(
        successResponse({
            message: '取得商品資料',
            data: resultProductSpec,
        }),
    );
});