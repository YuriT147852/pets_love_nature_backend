import { Router } from 'express';
import * as UploadController from '@/controllers/upload';

import multer from 'multer';
const router = Router();

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

router.post('/image', upload.single('file'),
  /*
    #swagger.tags= ['Upload']
    #swagger.description = '上傳一張圖片，支援JPG、PNG和GIF格式，大小限制為5MB'
    #swagger.security=[{"Bearer": []}]
    #swagger.consumes = ['multipart/form-data']
      #swagger.parameters['file'] = {
        in: 'formData',
        description: '要上傳的圖片文件',
        name: 'file',
        type: 'file',
        required: true
      }
    #swagger.responses[200] = {
      description: '上傳成功',
      schema: {
        "status": 'success',
        "message": "上傳成功",
        "data": {
          "imgUrl": "https://storage.googleapis.com/petstore-3a2e1.appspot.com/images..."
        }
      }
    }
    #swagger.responses[400] = {
      description: '上傳失敗',
      schema: {
        "status": 'false',
        "message": "上傳失敗",
        "data": []
      }
    }
  */
  UploadController.uploadFile)


export default router;