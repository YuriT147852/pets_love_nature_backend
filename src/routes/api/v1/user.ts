import express from 'express';
import * as UserController from '@/controllers/user';
import { isAuth } from '@/middlewares';

const router = express.Router();

// github 登入
router.post(
    /**
     * #swagger.description  = "github 登入"
     * #swagger.responses[200] = {
            description: '登入成功',
            schema: {
                "status": true,
                "token": "eyJhbGciOiJI....",
                "result": {
                    "name": "Lori Murphy",
                    "email": "timmothy.ramos@example.com"
                }
            }
        }
     */
    '/githubLogin',
    UserController.githubLogin
);

// 取得使用者資訊
router.get(
    /**
     * #swagger.description  = "取得使用者資訊"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
                "token": "eyJhbGciOiJI....",
                "result": {
                    "name": "Lori Murphy",
                    "email": "timmothy.ramos@example.com"
                }
            }
        }
     */
    '/getInfo',
    isAuth,
    UserController.getInfo
);

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
router.get('/google', UserController.passportScope);

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
router.post(
    /**
     * #swagger.description  = "取得使用者資訊"
     * #swagger.responses[200] = {
            schema: {
                id: "663b9423ba76f3d8944cda27",
                message: "登入成功,
                "status": true,
                "token": "eyJhbGciOiJI....",
            }
        }
     */
    '/googlesignin',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    UserController.passportSession,
    UserController.passportFun
);

export default router;
