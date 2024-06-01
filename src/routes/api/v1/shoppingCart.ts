import { Router } from 'express';
import * as CartController from '@/controllers/shoppingCart';

const router = Router();

router.get(
    /**
     * #swagger.description  = "取得購物車資訊"
     * #swagger.tags = ['shoppingcart - 購物車']
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
    '/login/:id',
    CartController.getCartById
);

router.get(
    '/nologin',
    CartController.getCartNoLogin
);

router.post(
    /**
     * #swagger.description  = "新增單筆購物車"
     * #swagger.parameters['body'] = {
         in: "body",
        required: true,
        schema: {
        customerId: "66436361c2ae643fc43bf18a",
        shoppingCart: [
            {
            productSpec: "663f18d3fc11d10c288dc062",
            quantity: 1
            }
        ]
        }
    };
    * #swagger.responses[200] = {
        schema: {
        message: "成功",
        data: {
            customerId: "66436361c2ae643fc43bf18a",
            shoppingCart: [
            {
                quantity: 1,
                isChoosed: false,
                productSpec: "663f18d3fc11d10c288dc062",
                createdAt: "2024-05-22T14:17:38.487Z",
                updatedAt: "2024-05-22T14:17:38.487Z"
            }
            ],
            _id: "664dfe82f252412155131278"
        }
        }
    };
    * #swagger.responses[404] = {
                schema: {
                "status": "false",
                "message": "欄位錯誤",
            }
        }
     */
    "",
    CartController.addCart
)

router.delete(
    /**
     * #swagger.description  = "刪除單筆購物車資訊"
     * #swagger.parameters['body'] = {
         in: "body",
        required: true,
        schema: {
            {
                "customerId": "664e06e7f252412155131293",
                "productSpec": "663f18d3fc11d10c288dc062"
            }
        }
    };
    * #swagger.responses[200] = {
        schema: {
        message: "成功",
        data: "刪除成功"
        }
    };  
    * #swagger.responses[404] = {
                schema: {
                "status": "false",
                "message": "欄位錯誤",
            }
        }
     */
    "",
    CartController.deleteCart
)

export default router;
