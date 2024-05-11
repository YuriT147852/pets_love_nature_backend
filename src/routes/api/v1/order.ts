import express from 'express';
import * as OrderController from '@/controllers/order';

const router = express.Router();

router.get('/orders/:userid', OrderController.getOrdersList);

router.get('/order/:orderid', OrderController.getOrders);

export default router;
