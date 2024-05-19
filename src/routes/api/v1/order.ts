import express from 'express';
import * as OrderController from '@/controllers/order';
import { isAuth } from '@/utils/isAuth';
const router = express.Router();

router.get(
    /**
 * #swagger.description  = "取得訂單清單"
 * #swagger.tags = ['order - 消費者']
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

export default router;
