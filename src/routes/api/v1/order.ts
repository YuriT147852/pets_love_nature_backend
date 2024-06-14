import express from 'express';
import * as OrderController from '@/controllers/order';
import { isAuth } from '@/utils/isAuth';
const router = express.Router();

router.get(
    /**
 * #swagger.description  = "取得訂單清單"
 * #swagger.tags = ['order - 消費者']
 * #swagger.security=[{"Bearer": []}]
 * #swagger.responses[200] = {
        description: "取得成功",
        schema: {
            "message": "成功",
            "data": [
                {
                    "_id": "663f2c28c52d18d64cdb4570",
                    "orderDate": "2024-04-15T12:30:00.000Z",
                    "deliveryDate": "2024-04-15T12:30:00.000Z",
                    "orderAmount": 2000,
                    "orderStatus": 1
                },
            ]
        }
    }
 */

    '/orders/:userId',
    isAuth,
    OrderController.getOrdersList
);

router.get(
    /**
 * #swagger.description  = "取得單筆訂單資訊"
 * #swagger.security=[{"Bearer": []}]
 * #swagger.tags = ['order - 消費者']
 * #swagger.responses[200] = {
        description: "取得成功",
        schema: {
            "message": "成功",
            "data": [
                {
                    "_id": "663f2c28c52d18d64cdb4570",
                    "userId": "663f12237a6dabc6203875f4",
                    "orderProductList": [
                        {
                            "productId": "663f18d3fc11d10c288dc062",
                            "price": 300,
                            "amount": 5
                        }
                    ],
                    "orderDate": "2024-04-15T12:30:00.000Z",
                    "deliveryDate": "2024-04-15T12:30:00.000Z",
                    "orderAmount": 2000,
                    "orderStatus": 1,
                    "paymentMethod": 1,
                    "shippingUserName": "2024-04-15T12:30:00.000Z",
                    "deliveryAddress": {
                        "country": "台灣",
                        "county": "台北市",
                        "district": "信義區",
                        "address": "快樂鎮1234號5樓"
                    },
                    "note": "快點送",
                    "doneDate": "2024-04-15T12:30:00.000Z"
                }
            ]
        }
    }
 */
    '/order/:orderId',
    isAuth,
    OrderController.getOrders
);

router.post(
    /**
    * #swagger.description  = "新增結帳(連上第三方支付API)"
    * #swagger.tags = ['order - 消費者']
    * #swagger.security=[{"Bearer":[]}]
    * #swagger.parameters['body'] = {
        in: "body",
        required: true,
        schema: {
            "Email": "test@google.com",
            "Amt": 3000,
            "ItemDesc": "商品描述7777",
            "deliveryUserName":"王小名",
            "userId":"66436361c2ae643fc43bf18a",
                "orderProductList": [
                        {
                            "productId":"661a9a9fa892ea2a833a1009",
                            "price": 500,
                            "amount": 6
                        }
                ],
            "deliveryAddress": {
                    "country":"台灣",
                    "county":"台北市",
                    "district":"信義區",
                    "address":"快樂鎮12345號"
                }
            }
        }
    };
    * #swagger.responses[200] = {
        description: "取得成功",
        schema: {
            "status": "success",
            "data": {
                "PayGateWay": "https://ccore.newebpay.com/MPG/mpg_gateway",
                "Version": "2.0",
                "ResOrder": {
                    "Email": "test@google.com",
                    "Amt": 3000,
                    "ItemDesc": "商品描述7777",
                    "deliveryUserName": "王小名",
                    "userId": "66436361c2ae643fc43bf18a",
                    "orderProductList": [
                        {
                            "productId": "661a9a9fa892ea2a833a1009",
                            "price": 500,
                            "amount": 6
                        }
                    ],
                    "deliveryAddress": {
                        "country": "台灣",
                        "county": "台北市",
                        "district": "信義區",
                        "address": "快樂鎮12345號"
                    },
                    "TimeStamp": 1717912952,
                    "MerchantOrderNo": "6665457745933f177541666d",
                    "aesEncrypt": "6b8068a80867a3ff7ef669cd840286db7f7d33f8703a4e68245869cc718549e1e52023a3fc61938f654dd96eea24027119bf2431ed7fc3ff25246e28653a10b3f2857d6c5457e55951c564c72bb6bb0e6f257317ade39a2d916c6832266f00d4e1df2435282b4cb7a1d4ebe68c04f9975d7f06856486fee7bf25e02d0aacd0292df3372df3dc8af1112dd2fad1df4389f297d0a2b15632f7ff242a13963670d9042e748586380272365187bb405b011989951c9f9afa4d5bd55b86be8dadbac5ca20057a14c2bf4190b9df45b49cb2b61bb6e57d7c77665614a7e63df75d61bb",
                    "shaEncrypt": "67A5B3D93A1F24822528F9A0163A64BBBE1A592AEBA58A9089F2653D2C61D63A"
                },
                "MerchantID": "MS152505100",
                "NotifyUrl": "",
                "ReturnUrl": ""
            },
            "message": "成功抓取金流資訊"
        }
    }
     */
    '/payment',
    isAuth,
    OrderController.usePayment
);

export default router;
