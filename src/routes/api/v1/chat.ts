import { Router } from 'express';
import * as ChatController from '@/controllers/chat';
// import { isAuth } from '@/utils/isAuth';

const router = Router();

/** 網站全端 */
router.get(
    /**
     * #swagger.description  = "取得單一使用者歷史資料"
     * #swagger.responses[200] = {
            schema: {
                "status": "success",
                "data": [
                    {
                    "_id": "667fbef84b42bfa8fc1a1709",
                    "messageList": [
                        {
                            "role": "client",
                            "read": false,
                            "message": "這是訊息888",
                            "chatId": "667fbf154b42bfa8fc1a170e",
                            "createdAt": "2024-06-29T08:00:21.851Z"
                        },
                    ],
                    "createdAt": "2024-06-29T07:59:52.835Z",
                    "customerId": "663f12237a6dabc6203875f4"
                    }
                ],
                "message": "抓取使用者歷史資訊成功"
            }
        }
     */
    '/getChatHistory/:customerId',
    ChatController.getChatHistory
);

export default router;
