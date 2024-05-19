import { Router } from 'express';
import * as CartController from '@/controllers/shoppingCart';

const router = Router();

router.get(
    '/:id',
    CartController.getCartById
);

router.post(
    "",
    CartController.addCart
)

export default router;
