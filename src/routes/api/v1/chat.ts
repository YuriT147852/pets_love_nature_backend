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
                    "_id": "666d55e6c28192e47c6c27d5",
                    "userId": "663f12237a6dabc6203875f4",
                    "messageList": [
                        {
                           "role": "client",
                            "read": true,
                            "message": "安安你好",
                            "chatId": "661a9a9fa892ea2a833a1009",
                            "createdAt": "2024-06-15T08:50:50.723Z"
                        },
                    ],
                    "createdAt": "2024-06-15T08:50:46.093Z"
                    }
                ],
                "message": "抓取使用者歷史資訊成功"
                }
        }
     */
    '/getChatHistory/:userId',
    ChatController.getChatHistory
);

export default router;
