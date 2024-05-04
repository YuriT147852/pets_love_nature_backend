import express from 'express';
import * as UserController from '@/controllers/user';
import { isAuth } from '@/middlewares';
import axios from 'axios';
import jwt from 'jsonwebtoken';
const router = express.Router();

// 從環境變量中獲取 GitHub 和 JWT 的配置信息
const { GITHUB_CLIENT_ID, GITHUB_SECRET, JWT_SECRET, HOST } = process.env;

// 定義 GitHub OAuth 的配置信息
const GITHUB_CONFIG = {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_SECRET,
    redirectURI: `${HOST}/callback`
};

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

// 路由處理 GitHub 回傳
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    // 使用授權碼換取存取 Token
    const tokenURL = `https://github.com/login/oauth/access_token`;
    const response = await axios.post(tokenURL, null, {
        params: {
            client_id: GITHUB_CONFIG.clientID,
            client_secret: GITHUB_CONFIG.clientSecret,
            code: code
        },
        headers: {
            Accept: 'application/json'
        }
    });
    const { access_token } = response.data;

    // 使用存取 Token 獲取 GitHub 用戶資訊
    const userResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${access_token}` }
    });

    // 獲取用戶電子郵件地址
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${access_token}` }
    });
    const user = {
        ...userResponse.data,
        email: emailResponse.data[0].email
    };

    // 可在此處將用戶資訊存儲到資料庫
    console.log('user', user);


    // 生成 JWT 並設置為 cookie
    const token = jwt.sign(user, JWT_SECRET);

    res.cookie('token', token);

    try {
        res.redirect('/index.html'); // 跳轉回前端頁面
    } catch (error) {
        console.log('redirect', error);
    }
});

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

export default router;
