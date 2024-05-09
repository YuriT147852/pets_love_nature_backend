import { Router } from 'express';
import user from './api/v1/user';
import customer from './api/v1/customer';
import { callback } from '@/controllers/user';
import swagger from './swagger';

const routes = Router();
routes.use(swagger);

routes.use(
    /**
     * #swagger.tags = ["Users - 使用者"]
     */
    '/api/v1/user',
    user
);

routes.use(
    /**
     * #swagger.tags = ["Customer - 消費者"]
     */
    '/api/v1/customer',
    customer
);

// 路由處理 GitHub 回傳
routes.use('/callback', callback);

export default routes;
