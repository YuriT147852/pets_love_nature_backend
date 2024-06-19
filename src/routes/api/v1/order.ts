import express from 'express';
import * as OrderController from '@/controllers/order';
import { isAuth } from '@/utils/isAuth';
const router = express.Router();

router.get(
    /**
 * #swagger.description  = "取得訂單清單"
 * #swagger.tags = ["Order - 訂單"]
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
 * #swagger.tags = ["Order - 訂單"] 
 * #swagger.responses[200] = {
        description: "取得成功",
        schema: {
            "status": "success",
            "data": [
                {
                "_id": "6672df9274d4bcc0f6154590",
                "userId": "66436361c2ae643fc43bf18a",
                "orderProductList": [
                    {
                    "productId": "661a9a9fa892ea2a833a1009",
                    "price": 500,
                    "quantity": 123,
                    "productTitle": "111",
                    "coverImg": "aaa"
                    }
                ],
                "orderStatus": -3,
                "deliveryUserName": "王小名",
                "deliveryAddress": {
                    "country": "台灣",
                    "county": "台北市",
                    "district": "信義區",
                    "address": "快樂鎮12345號"
                },
                "note": "",
                "deliveryEmail": "test@google.com",
                "deliveryPhone": "0978071727",
                "orderDate": "2024-06-19T13:39:30.850Z",
                "createdAt": "2024-06-19T13:39:30.852Z",
                "updatedAt": "2024-06-19T13:39:30.852Z"
                }
            ],
            "message": "取得訂單資訊成功"
            }
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
    * #swagger.tags = ["Order - 訂單"]
    * #swagger.security=[{"Bearer":[]}]
    * #swagger.parameters['body'] = {
        in: "body",
        required: true,
        schema: {
            "Email": "test@google.com",
            "Amt": 3000,
            "ItemDesc": "商品描述7777",
            "deliveryUserName": "王小名",
            "userId": "66436361c2ae643fc43bf18a",
            "deliveryPhone":"0978071727",
            "orderProductList": [
                {
                "productId": "661a9a9fa892ea2a833a1009",
                "price": 500,
                "amount": 6,
                "coverImg":"aaa",
                "productTitle":"111",
                "quantity":123
                }
            ],
            "deliveryAddress": {
                "country": "台灣",
                "county": "台北市",
                "district": "信義區",
                "address": "快樂鎮12345號"
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
                    "deliveryPhone": "0978071727",
                    "orderProductList": [
                        {
                            "productId": "661a9a9fa892ea2a833a1009",
                            "price": 500,
                            "amount": 6,
                            "coverImg": "aaa",
                            "productTitle": "111",
                            "quantity": 123
                        }
                    ],
                    "deliveryAddress": {
                        "country": "台灣",
                        "county": "台北市",
                        "district": "信義區",
                        "address": "快樂鎮12345號"
                    },
                    "TimeStamp": 1718804371,
                    "MerchantOrderNo": "6672df9274d4bcc0f6154590",
                    "aesEncrypt": "6b8068a80867a3ff7ef669cd840286db7f7d33f8703a4e68245869cc718549e14ca5561a8de23a6dfb6ff3eb054e1a085a4d04a2b11b0d872c5e03d5c1d3f3042950d47c3b0854dccedf2ae3a833672dc5e7dcd4a03459e18a1149c555f896035316def8572f19052fffe8e72a8a03a0a40ee12929bda59a630573b801916afac67ac7527fb6f69303c4ee5514195dae3258f1d9399e535edb123a7681a41d1d7750eace50f40fe16ea3bb5c6ec94d4c651becced64814bef287a9678be8472b5c1de534f2d1f70559f4bbb4176e36f8c359d8fda6775ad01ef12490e4e1230b6baad61e82982f0403b9ff388e0605e945ac56a2970fea6cb19f7e549aec9814b9d990c3a29a4fb2fb169cf941ae6945609fbed31cfbf799069ec67a3960d4968f8f0cce8fa2dc67323a149850b11125cdbfa04f30579271d7c431a4c6c6ec7f5554bfac55a83d83b1d80864d2c28d90d9e250ad9cbca82dec0964f565a7e8c306b5b551418f17c014c9fa7a0ee15adf55203e75c4cb66d6e1ca6460acbb5c64",
                    "shaEncrypt": "230D3C0F6D18D8C0D5837174CDD09F66B0096B4796AD8CD91C2389AFB1F17CF5"
                },
                "MerchantID": "MS152505100",
                "NotifyUrl": "https://pets-love-nature-backend-n.onrender.com/api/v1/payment_notify",
                "ReturnUrl": "https://petslovenature-frontstage.onrender.com/checkout/step3"
            },
            "message": "成功抓取金流資訊"
        }
    }
     */
    '/payment',
    isAuth,
    OrderController.usePayment
);

router.post('/payment_notify', OrderController.PaymentNotify);

export default router;
