import { Router } from 'express';
import * as CartController from '@/controllers/shoppingCart';

const router = Router();

router.get(
    '/:id',
    CartController.getCartById
);

export default router;
