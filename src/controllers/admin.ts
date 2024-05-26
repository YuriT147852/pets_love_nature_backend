import { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import { generateToken_BACK } from '@/utils/index';

export const adminSignIn: RequestHandler = handleErrorAsync((req, res, next) => {
    const { account, password } = req.body;

    // console.log(account, password);
    if (!account || !password) {
        next(errorResponse(400, '帳號密碼格式錯誤'));
        return;
    }

    if (account !== 'admin' || password !== 'abc123456789') {
        next(errorResponse(400, '帳號或密碼錯誤'));
        return;
    }

    const token = generateToken_BACK({ account: 'admin' });

    res.status(200).json(
        successResponse({
            message: '登入成功',
            data: {
                token
            }
        })
    );
});
