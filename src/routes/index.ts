import { Router } from 'express';
import swagger from './swagger';
import customer from './api/v1/customer';
import order from './api/v1/order';
import product from './api/v1/product';
import adminProduct from './api/v1/admin/product';
import shoppingCart from './api/v1/shoppingCart';

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
     * #swagger.tags = ["Customer - 消費者"]
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
     * #swagger.tags = ["Product - 商品"]
     */
    '/api/v1/product',
    product
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
     * #swagger.tags = ["shoppingcart - 購物車"]
     */
    '/api/v1/shopping_cart',
    shoppingCart
);

export default routes;
