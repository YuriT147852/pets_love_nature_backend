import { Router } from 'express';
import * as ProductController from '@/controllers/product';
import { Back_isAuth } from '@/utils/isAuth';

const router = Router();

// 取得全部商品列表
router.get(
    /**
     * #swagger.description  = "取得所有商品列表"
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": [
                    { $ref: '#/definitions/ProductListResponses' }
                ]
            }
        }
     */
    '/all',
    ProductController.getProductList
);

// 取得單一商品詳細資料
router.get(
    /**
     * #swagger.description  = "取得單一商品詳細資料"
     * #swagger.parameters['id'] = { description: '商品規格ID' }
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": { $ref: '#/definitions/SingleProductResponses' }
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": "false",
                "message": "此商品不存在",
            }
        }
     */
    '/:id',
    ProductController.getProductById
);

// 取得篩選條件商品列表
router.get(
    /**
     * #swagger.description  = "取得篩選條件商品列表"         
     * #swagger.parameters['onlineStatus'] = {
            required: false,
            description: '上線狀態',
            type: 'boolean',
            enum:['true','false'],
            }
     * #swagger.parameters['searchText'] = { description: '關鍵字' }
     * #swagger.parameters['filterCategory'] = { description: '分類；fresh、cat、dog、dry' }
     * #swagger.parameters['sortOrder'] = { description: '選擇排序方式，預設-1；-1 由大到小 / 1 由小到大' }
     * #swagger.parameters['sortBy'] = { description: '以指定項目排序，預設評價；項目：評價：star，價格：price，更新時間：updatedAt；銷售量：salesVolume' }
     * #swagger.parameters['page'] = { description: '前往指定頁數，預設1' }
     * #swagger.parameters['limit'] = { description: '顯示筆數，預設10' }
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": [
                    { $ref: '#/definitions/ProductResponses' }
                ],
                "page": {
                    "nowPage": 1,
                    "totalPages": 10
                }
            }
        }
     */
    '',
    ProductController.getAdminProductList
);

// 新增商品
router.post(
    /**
     * #swagger.description  = "新增商品"
     * #swagger.security=[{"Bearer": []}]
          * #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                "title": "鮮嫩雞胸肉凍乾",
                "subtitle": "新鮮雞胸肉，符合人食等級，富含高品質蛋白質，提供毛孩維持健康體愛所需的重要營養素",
                "category": ["dry", "fresh", "cat", "dog"],
                "otherInfo": [{ "infoName": "產地", "infoValue": "台灣" }],
                "productSpecList": [
                    {
                        "weight": 50,
                        "price": 60,
                        "inStock": 50,
                    },
                    {
                        "weight": 200,
                        "price": 180,
                        "inStock": 50,
                    }
                ],
                "imageGallery": 
                        [
                            {
                                "imgUrl": "https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                "altText": "狗鮮食"
                            }
                        ],
                        }            
        }
     * #swagger.responses[404] = {
            schema:             {
                "status": "false",
                "message": "欄位錯誤",
            }
        }
     */
    '', Back_isAuth,
    ProductController.createProduct
);

// 新增商品規格
router.post(
    /**
     * #swagger.description  = "新增已有商品資訊的商品規格"
     * #swagger.security=[{"Bearer": []}]
          * #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                "productId": "661a9a9fa892ea2a81234567",
                "productSpecList": [
                    {
                        "weight": 50,
                        "price": 60,
                        "inStock": 50,
                    },
                    {
                        "weight": 200,
                        "price": 180,
                        "inStock": 50,
                    }
                ]
            }           
        }
     * #swagger.responses[404] = {
            schema:             {
                "status": "false",
                "message": "欄位錯誤",
            }
        }
     */
    '/createProductSpec', Back_isAuth,
    ProductController.createProductSpec
);

// 修改商品
router.patch(
    /**
     * #swagger.description  = "修改商品資訊或商品規格"
     * #swagger.security=[{"Bearer": []}]
     * #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                "productId": "",
                "title": "鮮嫩雞胸肉凍乾",
                "subtitle": "新鮮雞胸肉，符合人食等級，富含高品質蛋白質，提供毛孩維持健康體愛所需的重要營養素",
                "category": ["dry", "fresh", "cat", "dog"],
                "otherInfo": [{ "infoName": "產地", "infoValue": "台灣" }],
                "description": " <p>\n          24h 快速出貨:fire:<br>\n          :smiley_cat:貓肉泥主食罐:dog:<br>\n          嚴選人食等級肉品，100%純天然健康、絕無添加！<br>!!照護毛孩健康是我們的本份:sparkling_heart:我們的包裝簡約卻充滿溫暖，用心經營每一個細節，只為了將成本降至最低，讓品質卻提升至最高，將這份愛與呵護，完美呈現在毛孩的每一餐中:heart_eyes:\n          TW台灣加工廠直售，我們與您攜手守護毛孩的健康，原料、加工到包裝一條龍作業全都在台灣在地生產製作:fire:\n          如有相關問題歡迎聊聊~小編竭盡所能&盡快的回覆🫶️※ 小編回覆時間為9:00~小編愛睏為止:relieved:\n          ⚠近期繁多包裹詐騙⚠突如其來的貨到付款...等手法!!請家長們再三確認訂單系統通知:fire:為了預防詐騙:fire:建議使用信用卡付款、轉帳付款。\n        </p>",
                "imageGallery": 
                        [
                            {
                                "imgUrl": "https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                "altText": "狗鮮食"
                            }
                        ],
                "productSpecList": [
                    {
                        "id": "",
                        "weight": 50,
                        "price": 60,
                        "inStock": 50,
                        "onlineStatus": false
                    },
                    {
                        "id": "",
                        "weight": 200,
                        "price": 180,
                        "inStock": 50,
                        "onlineStatus": false
                    }
                ]                    
            }
        }
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": { $ref: '#/definitions/ProductResponses' }
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": "false",
                "message": "商品規格ID不存在/商品資訊ID不存在",
            }
        }
     */
    '/updateProductById', Back_isAuth,
    ProductController.updateProductById
);

// 刪除商品規格
router.delete(
    /**
     * #swagger.description= "刪除商品規格" 
     * #swagger.security=[{"Bearer": []}]
     * #swagger.parameters['id'] = { description: '商品規格ID' }
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "message": "刪除商品規格成功",
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": "false",
                "message": "商品規格不存在",
            }
        }
     */
    '/:id', Back_isAuth,
    ProductController.deleteProductSpecById
);

export default router;
