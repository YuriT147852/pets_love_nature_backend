import { Router } from 'express';
import * as BannerController from '@/controllers/banner';

const router = Router();


router.get(
    /**
      * #swagger.description  = "取得banner資訊"
      * #swagger.tags = ["Banner - 橫幅"]
      * #swagger.security=[{"Bearer": []}]
      * #swagger.responses[200] = {
         description: "取得成功",
         schema: {
        "status": "success",
        "data": [
            {
            "_id": "666da3c56f27eb2d59acfbd2",
            "hyperlink": "https://tw.yahoo.com",
            "title": "全人食等級，寵愛每一口",
            "subtitle": "原塊肉品，天然凍乾，保留原味原相",
            "imgUrl": "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
            "active": true
            }
        ],
        "message": "前台取得banner成功"
        }
     }
 */
    '',
    BannerController.getFrontBanner
);

export default router;
