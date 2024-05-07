import { RequestHandler } from 'express';
// import { AppError } from '@/service/AppError'; // 先註解測試Render部屬
import { handleErrorAsync } from '@/utils/handleErorr';

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
