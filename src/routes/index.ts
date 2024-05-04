import { Router } from 'express';
import user from './api/v1/user';
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

// 路由處理 GitHub 回傳
routes.use('/callback', callback);

export default routes;
