import express, { RequestHandler } from 'express';
import passport from 'passport';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateToken } from '@/utils/index';
import CustomerModel from '@/models/customer';

const app = express();

// 底下為google第三方
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

export const passportGoogleScope: RequestHandler = handleErrorAsync(async (_req, _res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await passport.authenticate('google', {
        scope: ['email', 'profile']
    })(_req, _res, next);
});

export const passportGoogleCallback: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const authenticate = () => {
        return new Promise(resolve => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            passport.authenticate('google', { session: false }, (error, user) => {
                if (error) {
                    next(errorResponse(500, 'Passport authentication error'));
                    return;
                } else if (!user) {
                    next(errorResponse(401, 'Passport authentication failed'));
                    return;
                }
                resolve(user);
            })(req, res, next);
        });
    };

    interface GoogleJson {
        _json: { name: string; email: string; picture: string };
    }

    const googleRes = (await authenticate()) as GoogleJson;
    const { name, email, picture } = googleRes._json;

    const resCustomer = await CustomerModel.findOne({ email });
    // console.log(resCustomer);
    //先判斷有沒有這個email
    if (resCustomer !== null) {
        // console.log('不須註冊');
        const token = generateToken({ userId: resCustomer._id });
        res.status(200).json(
            successResponse({
                message: '登入成功',
                data: {
                    id: resCustomer._id,
                    token
                },
            }),
        );
        return;
    } else {
        // console.log('需註冊');
        const resCustomer = await CustomerModel.create({ email, customerName: name, image: picture });
        const token = generateToken({ userId: resCustomer._id });
        res.status(200).json(
            successResponse({
                message: '第一次註冊+登入成功',
                data: {
                    id: resCustomer._id,
                    token
                },
            }),
        );
    }
});

export const getInfo: RequestHandler = async (req, res, next) => {
    try {
        const result = await CustomerModel.findOne({
            _id: req.params.id
        });
        res.status(200).json(
            successResponse({
                message: '取得會員資訊成功',
                data: result,
            }),
        );
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
            recipientPhone,
            recipientAddress: { country, county, district, address }, // 收件人地址資訊
            deliveryAddress: { country: deliveryCountry, county: deliveryCounty, district: deliveryDistrict, address: deliveryAddress } // 預填的會員地址資訊
        } = req.body;

        const result = await CustomerModel.findByIdAndUpdate(
            req.params.id,
            {
                customerName,
                phone,
                image,
                recipientName,
                recipientPhone,
                recipientAddress: {
                    country,
                    county,
                    district,
                    address
                },
                deliveryAddress: {
                    country: deliveryCountry,
                    county: deliveryCounty,
                    district: deliveryDistrict,
                    address: deliveryAddress
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!result) {
            next(errorResponse(404, '會員資訊不存在'));
            return;
        }
        res.status(200).json(
            successResponse({
                message: '更新會員資訊成功',
                data: result,
            }),
        );
    } catch (error) {
        next(error);
    }
};
