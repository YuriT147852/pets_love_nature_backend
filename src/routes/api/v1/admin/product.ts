import { Router } from 'express';
import * as ProductController from '@/controllers/product';

const router = Router();

router.get(
    /**
     * #swagger.description  = "取得商品列表"
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": [
                    { $ref: '#/definitions/ProductResponses' }
                ]
            }
        }
     */
    '',
    ProductController.getProductList
);

router.get(
    /**
     * #swagger.description  = "取得單一商品詳細資料"
     * #swagger.parameters['id'] = { description: '商品ID.' }
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": { $ref: '#/definitions/ProductResponses' }
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

router.post(
    /**
     * #swagger.description  = "新增商品"
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
    '',
    ProductController.createOneOrder
);

router.delete(
    /**
     * #swagger.description  = "刪除商品規格" 
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "message": "刪除商品規格成功",
            }
        }
     * #swagger.responses[404] = {
            schema: {
                status": "false",
                "message": "商品規格不存在",
            }
        }
     */
    '/:id',
    ProductController.deleteProductSpecById
);

export default router;
