import { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import ChatModel from '@/models/chat';
import { successResponse } from '@/utils/successHandler';

//抓取單一使用者聊天室
export const getChatHistory: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const result = await ChatModel.find({
        userId: req.params.customerId
    });

    if (result.length === 0) {
        next(errorResponse(404, '該使用者不存在'));
        return;
    }

    res.status(200).json(
        successResponse({
            message: '抓取使用者歷史資訊成功',
            data: result
        })
    );
});
