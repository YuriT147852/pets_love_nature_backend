import type { RequestHandler } from 'express';
import bannerModel from '@/models/banner';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';

export const getBanner: RequestHandler = handleErrorAsync(async (_req, res, _next) => {
    const result = await bannerModel.find({});
    res.status(200).json(
        successResponse({
            message: '取得banner成功',
            data: result
        })
    );
});

export const addBanner: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { ImgUrl, hyperlink, title, subtitle } = req.body;

    if (!ImgUrl || !hyperlink || !title || !subtitle) {
        next(errorResponse(404, '欄位錯誤'));
        return;
    } else {
        await bannerModel.create({
            ImgUrl,
            hyperlink,
            title,
            subtitle
        });
        const result = await bannerModel.find({});
        res.status(200).json(
            successResponse({
                message: '新增banner成功',
                data: result
            })
        );
    }
});

export const updateBannerById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { ImgUrl, hyperlink, title, subtitle } = req.body;
    if (!ImgUrl || !hyperlink || !title || !subtitle) {
        next(errorResponse(404, '欄位錯誤'));
        return;
    } else {
        const id = req?.params?.id;
        const resultBanner = await bannerModel.findByIdAndUpdate(
            id,
            {
                ImgUrl,
                hyperlink,
                title,
                subtitle
            },
            { new: true } // 返回更新後的文檔
        );

        if (!resultBanner) {
            next(errorResponse(404, '此banner id不存在'));
            return;
        } else {
            res.status(200).json(
                successResponse({
                    message: '更新banner資料成功',
                    data: resultBanner
                })
            );
        }
    }
});

export const deleteBannerById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const id = req?.params?.id;
    const result = await bannerModel.findByIdAndRemove(id);

    if (!result) {
        next(errorResponse(404, 'banner id不存在'));
        return;
    }

    res.status(200).json(
        successResponse({
            message: '刪除banner成功'
        })
    );
});
