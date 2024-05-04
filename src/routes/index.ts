import { Router } from 'express';
import user from './api/v1/user';
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

export default routes;
