import { RequestHandler } from 'express';
import { handleErrorAsync } from '@/utils/errorHandler';

export const uploadFile: RequestHandler = handleErrorAsync(async (_req, _res, _next) => {
  // res.status(200).json({
  //   message: '成功',
  // });
});

