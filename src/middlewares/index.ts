import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import UsersModel from '@/models/user';
import { verifyToken } from '@/utils';

// token 驗證
export const isAuth: RequestHandler = async (req, _res, next) => {
    /**
     * #swagger.security = [{ "bearerAuth": [] }]
     * #swagger.responses[403] = {
            description: '重新登入',
            schema: {
                "status": "false",
                "message": "請重新登入",
            }
        }
     */
    try {
        const token = `${req.headers.authorization?.replace('Bearer ', '')}`;
        const result = verifyToken(token);

        const user = await UsersModel.findById(result.userId);
        if (!user) {
            throw createHttpError(404, '此使用者不存在');
        }

        req.user ??= user;

        next();
    } catch (error) {
        next(error);
    }
};
