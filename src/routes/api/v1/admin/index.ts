import { Router } from 'express';
import * as AdminController from '@/controllers/admin';
import * as CustomerController from '@/controllers/customer';
import { Back_isAuth } from '@/utils/isAuth';

const router = Router();

router.post(
    /**
    * #swagger.description  = "後台登入"
    * #swagger.parameters['body'] = {
        in: "body",
        required: true,
    };
     */
    '/signIn',
    AdminController.adminSignIn
);

router.patch(
    /**
    * #swagger.description  = "修改多筆使用者的狀態"
    * #swagger.security=[{"Bearer": []}]
    * #swagger.parameters['body'] = {
        in: "body",
        required: true,
        schema:{
            "ids":["663f12237a6dabc6203875f4","66436361c2ae643fc43bf18a"],
            "AccountStatus": 1
        }
    };
    * #swagger.responses[200] = {
            schema: {
                "status": "success",
                "message": "修改帳號狀態成功"
            }
        }
     */
    '/customers',
    Back_isAuth,
    CustomerController.updateAccountStatus
);

router.get(
    /**
     * #swagger.description = "取得消費者清單"
     * #swagger.parameters['page'] = { description: '頁數,預設第一頁' }
     * #swagger.parameters['limit'] = { description: '一筆幾頁,預設一筆10頁' }
     * #swagger.parameters['search'] = { description: '搜尋關鍵字' }
     * #swagger.parameters['requestSame'] = { description: '完全一致, 預設0 0:模糊搜尋/1:完全一致' }
     * #swagger.parameters['sortBy'] = { description: '大小排序, -1:由大到小/1:由小到大' }
     * #swagger.parameters['sortOrder'] = { description: '排序種類 accountStatus:帳號狀態, email:電子郵件' }
     * #swagger.security=[{"Bearer": []}]
     * #swagger.responses[200] = {
            schema: {
                "status": "success",
                "data": {
                    "data": [
                        {
                            "_id": "663f12237a6dabc6203875f4",
                            "recipientName": "王大頭",
                            "phone": "0978071727",
                            "deliveryAddress": {
                                "country": "台灣",
                                "county": "台北市",
                                "district": "信義區",
                                "address": "快樂鎮1234號5樓"
                            },
                            "email": "d22495521@gmail.com",
                            "customerName": "王大頭3",
                            "image": "",
                            "accountStatus": 1,
                            "createdAt": "2024-05-11T06:37:23.956Z",
                            "updatedAt": "2024-06-22T06:40:39.764Z",
                            "recipientAddress": {
                                "country": "台灣",
                                "county": "台北市",
                                "district": "信義區",
                                "address": "快樂鎮1234號5樓"
                            },
                            "recipientPhone": "0978071727"
                        }
                    ],
                    "page": {
                        "totalPages": 19,
                        "nowPage": "1",
                        "totalDocuments": 19
                    }
                },
                "message": "查看帳號列表成功"
            },
        }
     */
    '/customerList',
    Back_isAuth,
    CustomerController.getCustomerList
);

export default router;
