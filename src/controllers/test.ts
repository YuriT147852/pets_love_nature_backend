import { RequestHandler } from 'express';
import { handleErrorAsync } from '@/utils/errorHandler';

export const getInfo: RequestHandler = handleErrorAsync((_req, res, _next) => {
    // if (1) {
    //     _next(AppError('帳號不能為空', 404));
    //     return;
    // }
    // console.log(cc);
    res.send({
        status: true,
        result: 11122
    });
});
