import { Router } from 'express';
import * as AdminController from '@/controllers/admin';
const router = Router();

router.post('/signIn', AdminController.adminSignIn);

export default router;
