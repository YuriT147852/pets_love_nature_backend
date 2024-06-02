import { Router } from 'express';
import * as AdminController from '@/controllers/admin';
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

export default router;
