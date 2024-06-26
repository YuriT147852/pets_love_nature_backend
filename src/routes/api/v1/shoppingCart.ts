import { Router } from 'express';
import * as CartController from '@/controllers/shoppingCart';
import { isAuth } from '@/utils/isAuth';

const router = Router();

router.get(
    /**
     * #swagger.description  = "取得購物車資訊"
     * #swagger.tags = ["ShoppingCart - 購物車"]
     * #swagger.security=[{"Bearer": []}]
     * #swagger.responses[200] = {
        description: "取得成功",
        schema: {
        "status": "success",
        "data": {
            "_id": "6648567e27b3916f705679d7",
            "customerId": "663f12237a6dabc6203875f4",
            "shoppingCart": [
            {
                "isChoosed": true,
                "quantity": 1,
                "createdAt": "2024-05-11T08:44:02.095Z",
                "updatedAt": "2024-05-11T08:44:02.095Z",
                "productSpec": null
            },
            {
                "isChoosed": true,
                "quantity": 1,
                "createdAt": "2024-05-11T08:44:02.095Z",
                "updatedAt": "2024-05-11T08:44:02.095Z",
                "productSpec": {
                "_id": "66487aba27b3916f705679f0",
                "productId": {
                    "_id": "663f18d3fc11d10c288dc062",
                    "title": "鮮嫩雞胸肉鮮食罐頭",
                    "productNumber": "A0001",
                    "imageGallery": [
                    {
                        "_id": "6664154b8c04ba2022ebc1ee",
                        "imgUrl": "https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        "altText": "狗鮮食"
                    }
                    ]
                },
                "productNumber": "B0001",
                "weight": 76,
                "price": 100,
                "inStock": 10,
                "onlineStatus": false
                }
            }
            ]
        },
        "message": "取得購物車資料成功"
        }
    }
 */
    '/login/:id',
    isAuth,
    CartController.getCartById
);

router.post(
    /**
     * #swagger.description  = "未登入取得購物車資訊"
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
     * #swagger.description  = "新增商品至購物車"
     * #swagger.security=[{"Bearer": []}]
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

router.patch(
    /**
     * #swagger.description  = "更新isChoosed狀態"
     * #swagger.parameters['body'] = {  
         in: "body",
        required: true,
        schema: {
            "customerId": "664e06e7f252412155131293",
            "shoppingCart": [
                {
                    "productSpec": "664c984699eb1ab9b3c4f679",
                    "isChoosed": true
                },
                {
                    "productSpec": "665deb4c904012a106605d63",
                    "isChoosed": true
                }
            ]
        }
    };
    * #swagger.responses[200] = {
        schema: {
  "status": "success",
  "data": {
    "_id": "66686259772c718d2ebe3de5",
    "customerId": "664e06e7f252412155131293",
    "shoppingCart": [
      {
        "quantity": 2,
        "isChoosed": true,
        "productSpec": "664c984699eb1ab9b3c4f679",
        "createdAt": "2024-06-16T12:24:25.905Z",
        "updatedAt": "2024-06-16T15:31:20.894Z"
      },
      {
        "quantity": 1,
        "isChoosed": true,
        "productSpec": "665deb4c904012a106605d63",
        "createdAt": "2024-06-16T12:35:24.074Z",
        "updatedAt": "2024-06-16T15:31:20.894Z"
      },
      {
        "quantity": 1,
        "isChoosed": false,
        "productSpec": "664c90d099eb1ab9b3c4f645",
        "createdAt": "2024-06-16T12:35:30.275Z",
        "updatedAt": "2024-06-16T15:39:26.017Z"
      },
      {
        "quantity": 1,
        "isChoosed": false,
        "productSpec": "665a9f704a2dbe2bbf936565",
        "createdAt": "2024-06-16T12:35:40.963Z",
        "updatedAt": "2024-06-16T12:35:40.963Z"
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
    "/",
    isAuth,
    CartController.updateIsChoosed)


router.delete(
    /**
     * #swagger.description  = "刪除單筆購物車資訊"
     * #swagger.security=[{"Bearer": []}]
     * #swagger.parameters['body'] = {
         in: "body",
        required: true,
        schema: {
                "customerId": "664e06e7f252412155131293",
                "productSpec": "663f18d3fc11d10c288dc062"
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
