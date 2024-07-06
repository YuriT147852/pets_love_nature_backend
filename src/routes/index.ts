import { Router } from 'express';
import swagger from './swagger';
import customer from './api/v1/customer';
import order from './api/v1/order';
import product from './api/v1/product';
import adminProduct from './api/v1/admin/product';
import shoppingCart from './api/v1/shoppingCart';
import upload from './api/v1/admin/upload';
import adminOrder from '@/routes/api/v1/admin/order';
import admin from '@/routes/api/v1/admin/index';
import comment from './api/v1/comment';
import adminBanner from './api/v1/admin/banner';
import chat from './api/v1/chat';
import banner from './api/v1/banner';

// import user from './api/v1/user';
// import { callback } from '@/controllers/user';
// routes.use(
//     /**
//      * #swagger.tags = ["Users - 使用者"]
//      */
//     '/api/v1/user',
//     user
// );
// 路由處理 GitHub 回傳
// routes.use('/callback', callback);

const routes = Router();
routes.use(swagger);

routes.use(
    /**
     * #swagger.tags = ["Customer - 消費者"]
     */
    '/api/v1/customer',
    customer
);

routes.use(
    /**
     * #swagger.tags = ["Order - 訂單"]
     */
    '/api/v1/',
    order
);

routes.use(
    /**
     * #swagger.tags = ["Product - 商品"]
     */
    '/api/v1/product',
    product
);

routes.use(
    /**
     * #swagger.tags = ["Comment - 評價"]
     */
    '/api/v1/comment',
    comment
);

routes.use(
    /**
     * #swagger.tags = ["ShoppingCart - 購物車"]
     */
    '/api/v1/shopping_cart',
    shoppingCart
);

routes.use(
    /**
     * #swagger.tags = ["chat - 聊天室"]
     */
    '/api/v1/chat',
    chat
);

routes.use(
    /**
     * #swagger.tags = ["Banner - 橫幅"]
     */
    '/api/v1/banner',
    banner
);

routes.use(
    /**
     * #swagger.tags = ["Admin / Customer - 管理者 / 會員 "]
     */
    '/api/v1/admin',
    admin
);

routes.use(
    /**
     * #swagger.tags = ["Admin / Product - 管理者 / 商品"]
     */
    '/api/v1/admin/product',
    adminProduct
);

routes.use(
    /**
     * #swagger.tags = ["Admin / Product - 管理者 / 訂單"]
     */
    '/api/v1/admin',
    adminOrder
);

routes.use(
    /**
     * #swagger.tags = ["Admin / Upload - 管理者 / 上傳檔案"]
     */
    '/api/v1/admin/upload',
    upload
);

routes.use(
    /**
     * #swagger.tags = ["Admin / Banner - 管理者 / Banner"]
     */
    '/api/v1/admin/banner',
    adminBanner
);

export default routes;
