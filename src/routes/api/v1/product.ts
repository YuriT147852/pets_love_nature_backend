import { Router } from 'express';
import * as ProductController from '@/controllers/product';

const router = Router();

router.get(
    /**
     * #swagger.description  = "取得商品列表"
     * #swagger.responses[200] = {
            schema: {
                "status": true,
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
                "status": true,
                "result": { $ref: '#/definitions/ProductResponses' }
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": false,
                "message": "此房型不存在",
            }
        }
     */
    '/:id',
    ProductController.getProductById
);



export default router;
