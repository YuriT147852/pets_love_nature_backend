import { Request, RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import firebaseAdmin from '@/service/firebase'
import { v4 as uuidv4 } from 'uuid'

interface MulterRequest extends Request {
  file: any;
}

const bucket = firebaseAdmin.storage().bucket()
// export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
export const uploadFile: RequestHandler = handleErrorAsync((req, res, next) => {
  // 取得上傳的檔案資訊
  const file = (req as MulterRequest).file;
  if (!file) {
    return next(errorResponse(400, '未找到檔案'));
  }

  // 基於檔案的原始名稱建立一個 blob 物件
  const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`);
  // 建立一個可以寫入 blob 的物件
  const blobStream = blob.createWriteStream()

  // 監聽上傳狀態,當上傳完成時,會觸發 finish 事件
  blobStream.on('finish', () => {
    // 設定檔案的存取權限
    const config = {
      action: 'read' as const,
      expires: '2500-12-31' // 使用 'YYYY-MM-DD' 格式
    }

    // 取得檔案的網址
    blob.getSignedUrl(config, (err, imgUrl) => {
      if (err || !imgUrl) {
        errorResponse(404, '上傳失敗')
      }

      res.status(200).json(
        successResponse({
          message: '上傳成功',
          data: { imgUrl },
        }),
      );
    })
  })

  // 如果上傳過程中發生錯誤,會觸發 error 事件
  blobStream.on('error', () => {
    errorResponse(404, '傳過程中發生錯誤')
  })

  // 將檔案的 buffer 寫入 blobStream
  blobStream.end(file.buffer)

});