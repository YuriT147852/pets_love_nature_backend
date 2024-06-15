import type { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import ProductModel, { IProduct } from '@/models/product';
import ProductSpecModel, { IProductSpec } from '@/models/productSpec';
import { ICreateProduct, IShowProduct } from '@/types/product';
import { PipelineStage } from 'mongoose';


// 取得所有商品的評論
export const getAllCommentList: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await ProductSpecModel.find({}).populate({
    path: 'productId',
    select: 'title subtitle description star category otherInfo imageGallery'
  });
  if (result.length === 0) {
    next(errorResponse(404, '無商品資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得商品資料成功',
      data: result,
    }),
  );
});

// 取得單一商品資訊的評論
export const getFilterCommentList: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await ProductSpecModel.find({}).populate({
    path: 'productId',
    select: 'title subtitle description star category otherInfo imageGallery'
  });
  if (result.length === 0) {
    next(errorResponse(404, '無商品資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得商品資料成功',
      data: result,
    }),
  );
});

// 新增商品
export const createComment: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await ProductSpecModel.find({}).populate({
    path: 'productId',
    select: 'title subtitle description star category otherInfo imageGallery'
  });
  if (result.length === 0) {
    next(errorResponse(404, '無商品資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得商品資料成功',
      data: result,
    }),
  );
});

// 取得單一商品資訊的評論
export const getNoCommentOrderIdList: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await ProductSpecModel.find({}).populate({
    path: 'productId',
    select: 'title subtitle description star category otherInfo imageGallery'
  });
  if (result.length === 0) {
    next(errorResponse(404, '無商品資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得商品資料成功',
      data: result,
    }),
  );
});

// 取得消費者未評論的該筆訂單及商品資訊
export const getComment: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await ProductSpecModel.find({}).populate({
    path: 'productId',
    select: 'title subtitle description star category otherInfo imageGallery'
  });
  if (result.length === 0) {
    next(errorResponse(404, '無商品資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得商品資料成功',
      data: result,
    }),
  );
});