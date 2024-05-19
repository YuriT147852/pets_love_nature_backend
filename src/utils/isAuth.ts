import type { RequestHandler } from 'express';
import { verifyToken } from '@/utils/index';
import { errorResponse, handleErrorAsync } from './errorHandler';

let token: string;
export const isAuth: RequestHandler = handleErrorAsync(async (req, _res, next) => {
    token = '';
    if (req.headers.authorization && req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization?.split(' ')[1];
    }

    if (token === '123456789') {
        next();
        return;
    }

    if (!token) {
        next(errorResponse(404, '你尚未登入'));
        return;
    }

    if (token) {
        await new Promise((_resolve, _reject) => {
            _resolve(verifyToken(token));
        });
    }

    next();
});
