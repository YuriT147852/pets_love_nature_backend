import type { RequestHandler } from 'express';
import { handleErrorAsync } from '@/utils/handleError';
import { verifyToken } from '@/utils/index';
import { AppError } from './AppError';

let token: string;
export const isAuth: RequestHandler = handleErrorAsync(async (req, _res, _next) => {
    token = '';
    if (req.headers.authorization && req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization?.split(' ')[1];
    }

    if (!token) {
        _next(AppError('你尚未登入', 404));
        return;
    }

    if (token) {
        await new Promise((_resolve, _reject) => {
            _resolve(verifyToken(token));
        });
    }

    _next();
});
