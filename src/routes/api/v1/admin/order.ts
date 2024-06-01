import { Router } from 'express';
import * as OrderController from '@/controllers/order';
import { Back_isAuth } from '@/utils/isAuth';

const router = Router();

router.get(
    /**
     * #swagger.description  = "取得訂單清單"
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

export default router;
