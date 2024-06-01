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
     * #swagger.description  = "取得篩選條件商品列表"
     * #swagger.parameters['searchText'] = { description: '關鍵字' }
     * #swagger.parameters['sortOrder'] = { description: '選擇排序方式，預設-1；-1 由大到小 / 1 由小到大' }
     * #swagger.parameters['sortBy'] = { description: '以指定項目排序，預設評價；評價：star，價格：price，更新時間：updatedAt' }
     * #swagger.parameters['page'] = { description: '前往指定頁數' }
     * #swagger.parameters['limit'] = { description: '顯示筆數' }
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
                "message": "此商品存在",
            }
        }
     */
    '/:id',
    ProductController.getProductById
);



export default router;
