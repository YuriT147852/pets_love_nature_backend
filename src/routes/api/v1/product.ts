import { Router } from 'express';
import * as ProductController from '@/controllers/product';

const router = Router();

router.get(
    /**
     * #swagger.description  = "取得所有商品列表"
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
     * #swagger.parameters['sortBy'] = { description: '以指定項目排序，預設評價；項目：評價：star，價格：price，更新時間：updatedAt' }
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
    '/getFilterProductList',
    ProductController.getFilterProductList
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



export default router;
