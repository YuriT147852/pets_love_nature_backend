import express from 'express';
import * as CustomerController from '@/controllers/customer';
import { isAuth } from '@/utils/isAuth';

const router = express.Router();

router.get('/google', CustomerController.passportGoogleScope);

router.post(
    /**
     * #swagger.description  = "google第三方登入"
     * #swagger.responses[200] = {
            schema: {
                id: "663b9423ba76f3d8944cda27",
                message: "登入成功",
                "status": "true",
                "token": "eyJhbGciOiJI....",
            }
        }
     */
    '/googleSignIn',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    CustomerController.passportGoogleCallback
);

// 查詢消費者資訊
router.get(
    /**
     * #swagger.description  = "取得消費者資訊"
     * #swagger.responses[200] = {
            schema: {
                "status": 'success',
                "token": "eyJhbGciOiJI....",
                "result": {
                    "_id": "",
                    "customerName": "王大頭",
                    "phone": "0978071727",
                    "deliveryAddress": {
                        "country": "台灣",
                        "county": "台北市",
                        "district": "信義區",
                        "address": "快樂鎮1234號5樓"
                    },
                    "email": "test@gmail.com",
                    "image": "",
                    "accountStatus": 1,
                    "recipientName": "王大頭",
                    "recipientPhone": "0978071727",
                    "recipientAddress": {
                        "country": "台灣",
                        "county": "台北市",
                        "district": "信義區",
                        "address": "快樂鎮1234號5樓"
                    }
                }
            }
        }
     */
    '/:id',
    isAuth,
    CustomerController.getInfo
);

// 編輯會員資訊
router.put(
    /**
     * #swagger.description  = "更新使用者資訊"
     * #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                    "customerName": "王大頭",
                    "phone": "0978071727",
                    "deliveryAddress": {
                        "country": "台灣",
                        "county": "台北市",
                        "district": "信義區",
                        "address": "快樂鎮1234號5樓"
                    },
                    "recipientName": "王大頭",
                    "recipientPhone": "0978071727",
                    "recipientAddress": {
                        "country": "台灣",
                        "county": "台北市",
                        "district": "信義區",
                        "address": "快樂鎮1234號5樓"
                    },
                    "image": ""
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": "false",
                "message": "此消費者不存在",
            }
        }
     */
    '/:id',
    isAuth,
    CustomerController.updateInfo
);

//修改會員狀態
router.patch(
    /**
    * #swagger.description  = "修改多筆使用者的狀態"
    * #swagger.security=[{"Bearer": []}]
    * #swagger.parameters['body'] = {
        in: "body",
        required: true,
        schema:{
            "ids":["663f12237a6dabc6203875f4","66436361c2ae643fc43bf18a"],
            "AccountStatus": 1
        }
    };
    * #swagger.responses[200] = {
            schema: {
                "status": "success",
                "message": "修改帳號狀態成功"
            }
        }
     */
    '/CustomerStatus',
    isAuth,
    CustomerController.updateAccountStatus
);

export default router;
