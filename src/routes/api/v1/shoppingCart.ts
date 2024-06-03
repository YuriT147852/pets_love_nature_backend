import { Router } from 'express';
import * as CartController from '@/controllers/shoppingCart';
import { isAuth } from '@/utils/isAuth';

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
    isAuth,
    CartController.getCartById
);

router.post(
    /**
     * #swagger.description  = "新增單筆購物車"
     * #swagger.parameters['body'] = {  
         in: "body",
        required: true,
        schema: {
            "shoppingCart": [
                {
                    "productSpec": "66487aba27b3916f705679f0",
                    "quantity": 50
                },
                {
                    "productSpec": "6649cfcbcbe5453a4e99f004",
                    "quantity": 2
                }
            ]
        }
    };
    * #swagger.responses[200] = {
        schema: {
    "status": "success",
    "data": {
        "shoppingCart": [
            {
                "productSpec": {
                    "_id": "66487aba27b3916f705679f0",
                    "productId": {
                        "_id": "663f18d3fc11d10c288dc062",
                        "title": "鮮嫩雞胸肉鮮食罐頭",
                        "subtitle": "新鮮雞胸肉，符合人食等級，富含高品質蛋白質，提供毛孩維持健康體愛所需的重要營養素。",
                        "description": "",
                        "category": [
                            "fresh",
                            "dog"
                        ],
                        "otherInfo": [
                            {
                                "infoName": "產地",
                                "infoValue": "台灣"
                            }
                        ],
                        "star": 4,
                        "imageGallery": [
                            {
                                "_id": "665ddf18a1599b4d0a973c2f",
                                "imgUrl": "https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                "altText": "狗鮮食"
                            }
                        ]
                    },
                    "productNumber": "B0001",
                    "weight": 76,
                    "price": 100,
                    "inStock": 10,
                    "onlineStatus": false,
                    "createdAt": "2024-05-11T08:44:02.095Z",
                    "updatedAt": "2024-05-11T08:44:02.095Z"
                },
                "quantity": 10
            }
        ]
    },
    "message": "成功"
}
    };
    * #swagger.responses[404] = {
                schema: {
                "status": "false",
                "message": "欄位錯誤",
            }
        }
     */
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
            "customerId": "664e06e7f252412155131293",
            "addWay": 0,
            "shoppingCart": [
                {
                    "productSpec": "66487aba27b3916f705679f0",
                    "quantity": 2
                },
                {
                    "productSpec": "6649cfcbcbe5453a4e99f004",
                    "quantity": 3
                }
            ]
        }
    };
    * #swagger.responses[200] = {
        schema: {
        message: "成功",
        data: [
        {
            "productSpec": "66487aba27b3916f705679f0",
            "quantity": 10,
            "message": "",
            "status": 0
        },
        {
            "productSpec": "6649cfcbcbe5453a4e99f004",
            "quantity": 5,
            "message": "購物車數量大於庫存數量，已調整為庫存數量",
            "status": 1
        }
            ]
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
    isAuth,
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
    isAuth,
    CartController.deleteCart
)

export default router;
