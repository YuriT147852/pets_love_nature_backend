import { Router } from 'express';
import * as BannerController from '@/controllers/banner';
// import { isAuth } from '@/utils/isAuth';

const router = Router();

router.get(
   
    '/',
    // isAuth,
    BannerController.getBanner
);

router.post('/', BannerController.addBanner)
router.patch('/:id', BannerController.updateBannerById)
router.delete('/:id', BannerController.deleteBannerById)

export default router;
