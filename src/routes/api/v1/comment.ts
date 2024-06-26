import { Router } from 'express';
import * as CommentController from '@/controllers/comment';
import { isAuth } from '@/utils/isAuth';

const router = Router();

/** 網站全端 */
// 取得所有商品的評論
router.get(
    /**
     * #swagger.description  = "取得所有商品的評論"
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": [
                    { $ref: '#/definitions/CommentResponses' }
                ]
            }
        }
     */
    '',
    CommentController.getAllCommentList
);

// 取得單一商品資訊的評論
router.get(
    /**
     * #swagger.description  = "取得單一商品資訊的評論"
     * #swagger.parameters['productId'] = { description: '商品資訊ID' }
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": { $ref: '#/definitions/CommentResponses' }
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": "false",
                "message": "此商品不存在",
            }
        }
     */
    '/:productId',
    CommentController.getFilterCommentList
);

/** 消費者端 */
// 新增評論
router.post(
    /**
     * #swagger.description  = "新增評論"
     * #swagger.security=[{"Bearer": []}]
          * #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                "productId": "665a9f704a2dbe2bbf936563",
                "orderId": "666e983c8e72d5cb153de579",
                "customerId": "663f12237a6dabc6203875f4",
                "star": 4,
                "comment": "貓吃的非常喜歡"
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
    isAuth,
    CommentController.createComment
);

// 取得消費者未評論的訂單列表
router.get(
    /**
     * #swagger.description  = "取得消費者未評論的訂單列表"
     * #swagger.security=[{"Bearer": []}]
     * #swagger.parameters['customerId'] = { description: '消費者ID' }
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": [
                    { $ref: '#/definitions/CommentResponses' }
                ]
            }
        }
     */
    '/getNoCommentOrderIdList/:customerId',
    isAuth,
    CommentController.getNoCommentOrderIdList
);

// 取得消費者未評論的該筆訂單及商品資訊
router.get(
    /**
     * #swagger.description  = "取得消費者未評論的該筆訂單及商品資訊"
     * #swagger.security=[{"Bearer": []}]
     * #swagger.parameters['customerId'] = { description: '消費者ID' }
     * #swagger.parameters['orderId'] = { description: '訂單ID' }
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": [
                    { $ref: '#/definitions/CommentResponses' }
                ]
            }
        }
     */
    '/getNoComment/:customerId/:orderId',
    isAuth,
    CommentController.getComment
);

export default router;
