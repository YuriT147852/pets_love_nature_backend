import { RequestHandler } from 'express';
import { handleErrorAsync } from '@/utils/handleErorr';
import axios from 'axios';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import customer from '@/models/customer';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import express from 'express';
const app = express();

// 從環境變量中獲取 GitHub 和 JWT 的配置信息
const { GITHUB_CLIENT_ID, GITHUB_SECRET, HOST, JWT_SECRET } = process.env;
// 定義 GitHub OAuth 的配置信息
const GITHUB_CONFIG = {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_SECRET,
    redirectURI: `${HOST}/callback`
};
export const githubLogin: RequestHandler = (_req, res, next) => {
    try {
        const authURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CONFIG.clientID}&redirect_uri=${GITHUB_CONFIG.redirectURI}&scope=user:email`;
        res.redirect(authURL);
    } catch (error) {
        next(error);
    }
};

export const getInfo: RequestHandler = (req, res) => {
    res.send({
        status: true,
        result: req.user
    });
};

// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const callback: RequestHandler = async (req, res) => {
    const { code } = req.query as { code: string };

    try {
        // 使用授權碼換取存取 Token
        const tokenURL = `https://github.com/login/oauth/access_token`;
        const tokenResponse = await axios.post(tokenURL, null, {
            params: {
                client_id: GITHUB_CONFIG.clientID,
                client_secret: GITHUB_CONFIG.clientSecret,
                code: code
            },
            headers: {
                Accept: 'application/json'
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { access_token } = tokenResponse.data;

        // 使用存取 Token 獲取 GitHub 用戶資訊
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${access_token}` }
        });

        // 獲取用戶電子郵件地址
        const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `token ${access_token}` }
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user = {
            ...userResponse.data,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            email: emailResponse.data[0].email
        };

        // 可在此處將用戶資訊存儲到資料庫
        console.log('user', user);

        // 生成 JWT 並設置為 cookie
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        const token = jwt.sign(user, JWT_SECRET);

        res.cookie('token', token);
        res.redirect('/index.html'); // 跳轉回前端頁面
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

//底下為google第三方
const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, COOGLECAllBACK } = process.env;

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_SECRET_KEY,
            callbackURL: COOGLECAllBACK
        },
        (_accessToken, _refreshToken, profile, cb) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return cb(null, profile);
        }
    )
);

app.use(passport.initialize());

export const passportScope = passport.authenticate('google', {
    scope: ['email', 'profile']
});

export const passportSession = passport.authenticate('google', { session: false });

export const passportFun: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    const data = req.user?._json;
    const { name, email, picture } = data!;

    const resuser = await customer.findOne({ email });
    //先判斷有沒有這個email
    if (resuser !== null) {
        // console.log('不需註冊,直接返回');
        const token = jwt.sign({ data }, JWT_SECRET);
        res.status(200).json({
            status: true,
            message: '登入成功',
            id: resuser._id,
            token
        });
        return;
    } else {
        // console.log('需註冊');
        const rescustomer = await customer.create({ email, customerName: name, image: picture });
        const token = jwt.sign({ data }, JWT_SECRET);
        res.status(200).json({
            status: true,
            message: '登入成功',
            id: rescustomer._id,
            token
        });
    }
});
