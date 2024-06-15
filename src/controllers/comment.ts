import type { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import CommentModel from '@/models/comment';


// 取得所有商品的評論
export const getAllCommentList: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await CommentModel.find({});
  if (result.length === 0) {
    next(errorResponse(404, '無評論資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得所有商品的評論成功',
      data: result,
    }),
  );
});

// 取得單一商品資訊的評論
export const getFilterCommentList: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await CommentModel.find({});
  if (result.length === 0) {
    next(errorResponse(404, '無評論資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得所有商品的評論成功',
      data: result,
    }),
  );
});

// 新增商品
export const createComment: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await CommentModel.find({});
  if (result.length === 0) {
    next(errorResponse(404, '無評論資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得所有商品的評論成功',
      data: result,
    }),
  );
});

// 取得單一商品資訊的評論
export const getNoCommentOrderIdList: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await CommentModel.find({});
  if (result.length === 0) {
    next(errorResponse(404, '無評論資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得所有商品的評論成功',
      data: result,
    }),
  );
});

// 取得消費者未評論的該筆訂單及商品資訊
export const getComment: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await CommentModel.find({});
  if (result.length === 0) {
    next(errorResponse(404, '無評論資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得所有商品的評論成功',
      data: result,
    }),
  );
});