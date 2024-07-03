import express, { RequestHandler } from 'express';
import passport from 'passport';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateToken } from '@/utils/index';
import CustomerModel from '@/models/customer';
import ChatModel from '@/models/chat';
import { IShowAccountStatus, IShowAccountStatusByArray } from '@/types/customer';

const app = express();

// 底下為google第三方
// const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, GOOGLE_CAllBACK } = process.env;
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: GOOGLE_CLIENT_ID,
//             clientSecret: GOOGLE_SECRET_KEY,
//             callbackURL: GOOGLE_CAllBACK
//         },
//         (_accessToken, _refreshToken, profile, cb) => {
//             // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
//             return cb(null, profile);
//         }
//     )
// );

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, GOOGLE_CAllBACK_LOCAL, GOOGLE_CAllBACK } = process.env;

// 动态设置 GoogleStrategy
const configureGoogleStrategy = (callbackURL: string) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_SECRET_KEY,
                callbackURL
            },
            (_accessToken, _refreshToken, profile, cb) => {
                return cb(null, profile);
            }
        )
    );
};

app.use(passport.initialize());

export const passportGoogleScope: RequestHandler = handleErrorAsync(async (req, _res, next) => {
    // const callbackUrl = req.query.callbackUrl as string;
    // console.log(req.query);
    // if (!callbackUrl) {
    //     next(errorResponse(400, 'Missing callback URL'));
    //     return;
    // }

    const { env } = req.query;

    if (env !== 'pro' && env !== 'dev') {
        next(errorResponse(400, '網址參數錯誤'));
        return;
    }

    configureGoogleStrategy(env === 'pro' ? GOOGLE_CAllBACK : GOOGLE_CAllBACK_LOCAL);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await passport.authenticate('google', {
        scope: ['email', 'profile']
    })(req, _res, next);
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
                }
            })
        );
        return;
    } else {
        // console.log('需註冊');
        const resCustomer = await CustomerModel.create({ email, customerName: name, image: picture });
        const token = generateToken({ userId: resCustomer._id });

        //增加聊天室
        await ChatModel.create({ customerId: resCustomer._id, messageList: [] });

        res.status(200).json(
            successResponse({
                message: '第一次註冊+登入成功',
                data: {
                    id: resCustomer._id,
                    token
                }
            })
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
                data: result
            })
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
            deliveryAddress: {
                country: deliveryCountry,
                county: deliveryCounty,
                district: deliveryDistrict,
                address: deliveryAddress
            } // 預填的會員地址資訊
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
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
};

export const updateAccountStatus: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { AccountStatus, ids }: IShowAccountStatus = req.body;

    if (!Array.isArray(ids) || !ids) {
        next(errorResponse(400, 'ids格式錯誤'));
        return;
    } else if (ids.length === 0) {
        next(errorResponse(400, 'ids長度必須大於0'));
        return;
    } else if (AccountStatus === undefined) {
        next(errorResponse(400, 'AccountStatus格式錯誤'));
        return;
    }

    for (let i = 0; i < ids.length; i++) {
        await CustomerModel.updateMany(
            {
                _id: ids[i]
            },
            { accountStatus: AccountStatus }
        );
    }

    res.status(200).json(
        successResponse({
            message: '修改帳號狀態成功'
        })
    );
});

export const updateAccountStatusByArray: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { userData } = req.body as { userData: IShowAccountStatusByArray[] };

    if (!Array.isArray(userData)) {
        next(errorResponse(404, 'body資料錯誤'));
        return;
    }

    for (let i = 0; i < userData.length; i++) {
        await CustomerModel.updateOne(
            {
                _id: userData[i].id
            },
            { accountStatus: userData[i].AccountStatus }
        );
    }

    res.status(200).json(
        successResponse({
            message: '修改帳號狀態成功'
        })
    );
});

export const getCustomerList: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    const { page = 1, limit, sortOrder, sortBy, requestSame, search } = req.query;

    let searchObj = {};

    if (search) {
        const text: string = search as string;
        //模糊搜
        const regex = new RegExp(text);
        const filterRegex = { $regex: regex };
        const filterHandler = requestSame === '1' ? search : filterRegex;
        searchObj = { email: filterHandler };
    }

    // 默認 1 頁顯示 10 筆
    const pageSize = limit ? parseInt(limit as string, 10) : 10;
    // 獲取總筆數
    const totalDocuments = await CustomerModel.countDocuments(searchObj);
    // 獲取總頁數
    const totalPages = Math.ceil(totalDocuments / pageSize);
    //跳過比數
    const skip = (Number(page) - 1) * pageSize;
    //大小排序
    const filter = sortBy === '1' ? 1 : -1;

    const sortOptions: Record<string, 1 | -1> = {};

    if (sortOrder === 'accountStatus') {
        sortOptions['accountStatus'] = filter;
        sortOptions['email'] = 1;
    } else if (sortOrder === 'email') {
        sortOptions['email'] = filter;
        sortOptions['accountStatus'] = 1;
    } else {
        sortOptions['email'] = 1;
        sortOptions['accountStatus'] = 1;
    }
    const result = await CustomerModel.find(searchObj).skip(skip).limit(pageSize).sort(sortOptions);

    // 使用 Promise.all 来并行处理所有的聊天查询
    const chatQueries = result.map(customer => ChatModel.find({ customerId: customer._id }));
    const chats = await Promise.all(chatQueries);

    for (let i = 0; i < result.length; i++) {
        const chat = chats[i];
        result[i] = result[i].toObject();
        if (chat.length !== 0) {
            const unreadCount = chat[0].messageList.filter(msg => msg.role === 'client' && msg.read === false).length;
            result[i]['unreadCount'] = unreadCount;
        } else {
            result[i]['unreadCount'] = 0;
        }
    }

    const resData = {
        data: result,
        page: {
            totalPages,
            nowPage: page,
            totalDocuments
        }
    };

    res.status(200).json(
        successResponse({
            message: '查看帳號列表成功',
            data: resData
        })
    );
});
