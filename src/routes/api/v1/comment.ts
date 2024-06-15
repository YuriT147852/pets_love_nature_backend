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
    '/getAllCommentList',
    CommentController.getAllCommentList
);

// 取得單一商品資訊的評論
router.get(
    /**
     * #swagger.description  = "取得單一商品資訊的評論"
     * #swagger.parameters['productId'] = { description: '商品ID' }
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
    '/getFilterCommentList/:productId',
    CommentController.getFilterCommentList
);

/** 消費者端 */
// 新增評論
router.post(
    /**
     * #swagger.description  = "新增評論"
     * #swagger.security=[{"Bearer": []}]
     * #swagger.parameters['searchText'] = { description: '搜尋關鍵字' }
          * #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
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
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": [
                    { $ref: '#/definitions/CommentResponses' }
                ]
            }
        }
     */
    '/getNoCommentOrderIdList',
    isAuth,
    CommentController.getNoCommentOrderIdList
);

// 取得消費者未評論的該筆訂單及商品資訊
router.get(
    /**
     * #swagger.description  = "取得消費者未評論的該筆訂單及商品資訊"
     * #swagger.security=[{"Bearer": []}]
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "result": [
                    { $ref: '#/definitions/CommentResponses' }
                ]
            }
        }
     */
    '/getComment/:orderId',
    isAuth,
    CommentController.getComment
);

export default router;
