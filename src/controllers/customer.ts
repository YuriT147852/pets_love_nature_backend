import express, { RequestHandler } from 'express';
import { handleErrorAsync } from '@/utils/handleError';
import { AppError } from '@/service/AppError';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import CustomerModel from '@/models/customer';



const app = express();

// 底下為google第三方
const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, COOGLECAllBACK, JWT_SECRET } = process.env;
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

export const passportScope: RequestHandler = handleErrorAsync(async (_req, _res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await passport.authenticate('google', {
        scope: ['email', 'profile']
    })(_req, _res, next);
});

export const passportSession = passport.authenticate('google', { session: false });

export const passportFun: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    const authenticate = () => {
        return new Promise(resolve => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            passport.authenticate('google', { session: false }, (error, user) => {
                if (error) {
                    _next(AppError('Passport authentication error', 500));
                    return;
                } else if (!user) {
                    _next(AppError('Passport authentication failed', 401));
                    return;
                }
                resolve(user);
            })(req, res, _next);
        });
    };

    interface GoogleJson {
        _json: { name: string; email: string; picture: string };
    }

    const googleRes = (await authenticate()) as GoogleJson;
    const { name, email, picture } = googleRes._json;

    const resCustomer = await CustomerModel.findOne({ email });
    //先判斷有沒有這個email
    if (resCustomer !== null) {
        // console.log('不需註冊,直接返回');
        const token = jwt.sign({ name, email }, JWT_SECRET);
        res.status(200).json({
            status: true,
            message: '登入成功',
            id: resCustomer._id,
            token
        });
        return;
    } else {
        // console.log('需註冊');
        const resCustomer = await CustomerModel.create({ email, customerName: name, image: picture });
        const token = jwt.sign({ name, email }, JWT_SECRET);
        res.status(200).json({
            status: true,
            message: '登入成功',
            id: resCustomer._id,
            token
        });
    }
});

export const getInfo: RequestHandler = async (req, res, next) => {
    try {
        const result = await CustomerModel.findOne({
            _id: req.params.id,
        });
        if (!result) {
            next(AppError('消費者資訊不存在', 404));
            return;
        }
        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

export const updateInfo: RequestHandler = async (req, res, next) => {
    try {
        const {
            customerName,
            phone,
            image,
            recipientName,
            deliveryAddress: {
                country,
                county,
                district,
                address
            }
        } = req.body;

        const result = await CustomerModel.findByIdAndUpdate(
            req.params.id,
            {
                customerName,
                phone,
                image,
                recipientName,
                deliveryAddress: {
                    country,
                    county,
                    district,
                    address
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!result) {
            next(AppError('消費者資訊不存在', 404));
            return;
        }
        res.send({
            status: true,
            result
        });
    } catch (error) {
        next(error);
    }
};

