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

export default router;
