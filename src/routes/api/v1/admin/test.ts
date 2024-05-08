import express from 'express';
import * as test from '@/controllers/test';
const router = express.Router();

router.get('/gettest', test.getInfo);

export default router;
