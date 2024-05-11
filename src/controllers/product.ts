import type { RequestHandler } from 'express';
import { AppError } from '@/service/AppError';
import ProductSpecModel from '@/models/productSpec';

export const getProductList: RequestHandler = async (_req, res, _next) => {
    const result = await ProductSpecModel.find({}).populate({
        path: 'product',
        select: 'title subtitle description star category otherInfo imageGallery'
    });

    res.send({
        status: true,
        result
    });
};

export const getProductById: RequestHandler = async (req, res, next) => {
    const result = await ProductSpecModel.findOne({
        _id: req.params.id
    }).populate({
        path: 'product',
        select: 'title subtitle description star category otherInfo imageGallery'
    });

    if (!result) {
        next(AppError('此商品不存在', 404));
        return;
    }

    res.send({
        status: true,
        result
    });
};
