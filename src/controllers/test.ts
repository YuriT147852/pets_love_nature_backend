import { RequestHandler } from 'express';
// import { AppError } from '@/service/AppError'; // 先註解測試Render部屬
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
