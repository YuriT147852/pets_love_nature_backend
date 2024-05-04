import { RequestHandler } from 'express';
import { AppError } from '@/service/AppError';
import { handleErrorAsync } from '@/utils/handleErorr';
export const getInfo: RequestHandler = handleErrorAsync((_req, res, _next) => {
    // if (true) {
    //     _next(AppError('測試', 401));
    //     return;
    // }
    res.send({
        status: true,
        result: 11122
    });
});
