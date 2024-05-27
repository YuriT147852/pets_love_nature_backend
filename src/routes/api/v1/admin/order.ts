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
                    {
                        "_id": "663f2c28c52d18d64cdb4570",
                        "userId": "663f12237a6dabc6203875f4",
                        "email": "d22495521@gmail.com",
                        "orderStatus": 1
                    },
                    {
                        "_id": "6650489459f8875a5907eaf4",
                        "userId": "6649fb0de0b4e28164a7f81c",
                        "email": "s9654003@gmail.com",
                        "orderStatus": 1
                    },
                    {
                        "_id": "6650489459f8875a5907eaf6",
                        "userId": "665044dc59f8875a5907eaef",
                        "email": "sunqi@example.com",
                        "orderStatus": 1
                    },
                    {
                        "_id": "6650489459f8875a5907eaf3",
                        "userId": "663f12237a6dabc6203875f4",
                        "email": "d22495521@gmail.com",
                        "orderStatus": 1
                    }
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

export default router;
