import { Router } from 'express';
import * as BannerController from '@/controllers/banner';
import { Back_isAuth } from '@/utils/isAuth';

const router = Router();

router.get(
    /**
      * #swagger.description  = "取得banner資訊"
      * #swagger.tags = ["Admin / Banner - 管理者 / Banner"]
      * #swagger.security=[{"Bearer": []}]
      * #swagger.responses[200] = {
         description: "取得成功",
         schema: {
         "status": "success",
         "data": [
             {
             "_id": "666da3c56f27eb2d59acfbd2",
             "imgUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fzh.wikipedia.org%2Fzh-tw%2F%25E7%259A%25AE%25E5%258D%25A1%25E4%25B8%2598&psig=AOvVaw0_Wet9EgEid1MVb1EemYcP&ust=1718547829161000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOiDgdjn3YYDFQAAAAAdAAAAABAE",
             "hyperlink": "https://tw.yahoo.com",
             "title": "全人食等級，寵愛每一口",
             "subtitle": "原塊肉品，天然凍乾，保留原味原相",
             "active": true
             }
         ],
         "message": "取得banner成功"
         }
     }
 */
    '',
    Back_isAuth,
    BannerController.getBanner
);

router.post(
    /**
 * #swagger.description  = "新增Banner"
 * #swagger.security=[{"Bearer": []}]
 * #swagger.parameters['body'] = {  
            in: "body",
            required: true,
            schema: {
        "imgUrl": "https://cdn.vox-cdn.com/thumbor/lWOGzsPeAD6YzEVVNH001nrSqPM=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/24458108/captain_pikachu.jpg",
        "hyperlink": "https://tw.yahoo.com",
        "title": "好吃的食物在這裡",
        "subtitle": "好吃的食物在那裡",
        "active": true
    }
};
* #swagger.responses[200] = {
    schema: {
    "status": "success",
    "data": [
        {
        "_id": "666da3c56f27eb2d59acfbd2",
        "imgUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fzh.wikipedia.org%2Fzh-tw%2F%25E7%259A%25AE%25E5%258D%25A1%25E4%25B8%2598&psig=AOvVaw0_Wet9EgEid1MVb1EemYcP&ust=1718547829161000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOiDgdjn3YYDFQAAAAAdAAAAABAE",
        "hyperlink": "https://tw.yahoo.com",
        "title": "全人食等級，寵愛每一口",
        "subtitle": "原塊肉品，天然凍乾，保留原味原相",
        "active": true
        },
        {
        "_id": "666e84f4c0f5b12e507de79c",
        "imgUrl": "https://cdn.vox-cdn.com/thumbor/lWOGzsPeAD6YzEVVNH001nrSqPMfilters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/24458108/captain_pikachu.jpg",
        "hyperlink": "https://tw.yahoo.com",
        "title": "好吃的食物在這裡",
        "subtitle": "好吃的食物在那裡",
        "active": true
        }
    ],
    "message": "新增banner成功"
    }
};
* #swagger.responses[404] = {
            schema: {
            "status": "false",
            "message": "欄位錯誤",
        }
    }
 */
    '',
    Back_isAuth,
    BannerController.addBanner);

router.patch(
    /**
* #swagger.description  = "更新Banner"
* #swagger.security=[{"Bearer": []}]
* #swagger.parameters['body'] = {  
        in: "body",
        required: true,
        schema: {
    "imgUrl": "https://cdn.vox-cdn.com/thumbor/lWOGzsPeAD6YzEVVNH001nrSqPM=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/24458108/captain_pikachu.jpg",
    "hyperlink": "https://tw.yahoo.com",
    "title": "好吃的食物在這裡1",
    "subtitle": "好吃的食物在那裡1",
    "active": true
}
};
* #swagger.responses[200] = {
schema: {
"status": "success",
"data": [
    {
    "_id": "666da3c56f27eb2d59acfbd2",
    "imgUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fzh.wikipedia.org%2Fzh-tw%2F%25E7%259A%25AE%25E5%258D%25A1%25E4%25B8%2598&psig=AOvVaw0_Wet9EgEid1MVb1EemYcP&ust=1718547829161000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOiDgdjn3YYDFQAAAAAdAAAAABAE",
    "hyperlink": "https://tw.yahoo.com",
    "title": "全人食等級，寵愛每一口",
    "subtitle": "原塊肉品，天然凍乾，保留原味原相",
    "active": true
    },
    {
    "_id": "666e84f4c0f5b12e507de79c",
    "imgUrl": "https://cdn.vox-cdn.com/thumbor/lWOGzsPeAD6YzEVVNH001nrSqPMfilters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/24458108/captain_pikachu.jpg",
    "hyperlink": "https://tw.yahoo.com",
    "title": "好吃的食物在這裡",
    "subtitle": "好吃的食物在那裡",
    "active": true
    }
],
"message": "更新banner成功"
}
};
* #swagger.responses[404] = {
        schema: {
        "status": "false",
        "message": "欄位錯誤",
    }
}
*/
    '/:id',
    Back_isAuth,
    BannerController.updateBannerById);

router.delete(
    /**
     * #swagger.description  = "刪除Banner" 
     * #swagger.security=[{"Bearer": []}]
     * #swagger.responses[200] = {
            schema: {
                "status": "true",
                "message": "刪除Banner成功",
            }
        }
     * #swagger.responses[404] = {
            schema: {
                "status": "false",
                "message": "Banner id不存在",
            }
        }
     */
    '/:id',
    Back_isAuth,
    BannerController.deleteBannerById);

export default router;
