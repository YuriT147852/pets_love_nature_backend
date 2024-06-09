import { Router } from 'express';
import * as OrderController from '@/controllers/order';
import { Back_isAuth } from '@/utils/isAuth';
import rateLimit from 'express-rate-limit';

const router = Router();

router.get(
    /**
     * #swagger.description  = "取得訂單清單"
     * #swagger.parameters['page'] = { description: '頁數', required: true,}
     * #swagger.parameters['filterStatus'] = { description: '物流排序 1:小到大 / 0:大到小' }
     * #swagger.parameters['searchText'] = { description: '搜尋關鍵字' }
     * #swagger.parameters['requestSame'] = { description: '完全一致  0:false/1:true' }
     * #swagger.parameters['searchType'] = { description: '文字搜尋種類 email,orderNum' }
     * #swagger.security=[{"Bearer": []}]
     * #swagger.responses[200] = {
            schema: {
                "status": "success",
                    "data": {
                "OrderData": [
                    {
                        "_id": "6650489459f8875a5907eaf7",
                        "userId": "665044dc59f8875a5907eaf2",
                        "email": "zhengshi@example.com",
                        "orderStatus": -1
                    },
                ],
                "page": {
                    "nowPage": "1",
                    "totalPages": 2
                }
            },
            "message": "成功抓取訂單資訊"
            }
        }
     */
    '/orders',
    Back_isAuth,
    OrderController.getOrdersByAdmin
);

router.patch(
    /**
    * #swagger.description  = "修改某一筆訂單"
    * #swagger.security=[{"Bearer": []}]
    * #swagger.parameters['body'] = {
        in: "body",
        required: true,
        schema:{
            "orderId": "663f2c28c52d18d64cdb4570",
            "orderStatus": 1
        }
    };
    * #swagger.responses[200] = {
            schema: {
                "status": true,
                "message" : "更新成功",
            }
        }
     */
    '/updateOrder',
    Back_isAuth,
    OrderController.editOrderStatus
);

router.get(
    /**
     * #swagger.description  = "取得訂單清單"
     * #swagger.security=[{"Bearer": []}]
     * #swagger.responses[200] = {
            schema: {
            "status": "success",
            "data": [
                {
                    "_id": "6650489459f8875a5907eaf7",
                    "userId": {
                        "_id": "665044dc59f8875a5907eaf2",
                        "email": "zhengshi@example.com"
                    },
                    "orderProductList": [
                        {
                            "productId": "665044dc59f8875a5907eaf3",
                            "price": 700,
                            "amount": 2
                        }
                    ],
                    "orderDate": "2024-08-20T16:00:00.000Z",
                    "deliveryDate": "2024-08-20T16:00:00.000Z",
                    "orderAmount": 1400,
                    "orderStatus": -1,
                    "paymentMethod": 2,
                    "shippingUserName": "2024-08-20T16:00:00.000Z",
                    "deliveryAddress": {
                        "country": "台灣",
                        "county": "嘉義市",
                        "district": "東區",
                        "address": "東興街234號10樓"
                    },
                    "note": "盡快送達",
                    "doneDate": "2024-08-20T16:00:00.000Z"
                }
            ],
            "message": "取得消費者訂單成功"
            }
        }
     */
    '/order/:orderID',
    Back_isAuth,
    OrderController.getOrderById
);

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, //60秒
    max: 1,
    message: '請求太頻繁，請稍後重試',
    standardHeaders: true,
    legacyHeaders: false
});

router.get(
    /**
    * #swagger.description  = "取得ai生產文案，CD60s"
    * #swagger.parameters['text'] = { description: '生產文案內容', required: true,}
    * #swagger.security=[{"Bearer": []}]
    * #swagger.responses[200] = {
            schema: {
                "status": true,
                "message" : "文案內容",
            }
        }
     */
    '/openAi',
    Back_isAuth,
    apiLimiter,
    OrderController.getAiText
);

export default router;
