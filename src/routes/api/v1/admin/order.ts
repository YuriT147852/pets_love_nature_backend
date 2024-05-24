import { Router } from 'express';
import * as OrderController from '@/controllers/order';
const router = Router();

router.get('/orders', OrderController.getOrdersByAdmin);

export default router;
