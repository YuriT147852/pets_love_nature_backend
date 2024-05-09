import { Router } from 'express';
import swagger from './swagger';
import customer from './api/v1/customer';

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

export default routes;
