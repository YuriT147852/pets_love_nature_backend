import type { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import ProductModel from '@/models/product';
import ProductSpecModel from '@/models/productSpec';
import { ICreateProduct } from '@/types/product';

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
    // 1.先建立商品訊息
    const { title, subtitle, category, otherInfo, productSpecList }: ICreateProduct = req.body;

    if (productSpecList.length > 0) {
        let totalResProductSpec = 0;
        const resultProduct = await ProductModel.create({
            title,
            subtitle, category, otherInfo
        });
        const productId = await resultProduct._id;

        for (let i = 0; i < productSpecList.length; i++) {
            const productNumber = productSpecList[i].productNumber;
            const weight = productSpecList[i].weight;
            const price = productSpecList[i].price;
            const inStock = productSpecList[i].inStock;

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
        }
        totalResProductSpec = productSpecList.length;

        res.status(200).json(
            successResponse({
                message: '成功建立商品ID: ' + productId + ' 成功建立 ' + totalResProductSpec + ' 商品規格'
            }),
        );
    }
});