import type { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import CommentModel from '@/models/comment';
import CustomerModel from '@/models/customer';
import OrderModel from '@/models/orders';
import ProductModel from '@/models/product';


// 取得所有商品的評論
export const getAllCommentList: RequestHandler = handleErrorAsync(async (_req, res, next) => {
  const result = await CommentModel.find({}).populate({
    path: 'productId',
    select: 'title subtitle star category otherInfo imageGallery'
  }).populate({
    path: 'customerId',
    select: 'customerName image email'
  }).populate({
    path: 'orderId', select: '_id'
  });

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

// 新增
export const createComment: RequestHandler = handleErrorAsync(async (req, res, next) => {
  const { customerId,
    productId,
    orderId,
    star,
    comment } = req.body;

  const result = await CommentModel.create({
    customerId,
    productId,
    orderId,
    star,
    comment
  });

  const resCustomer = await CustomerModel.findOne({ _id: customerId });
  if (resCustomer) {
    await result.populate({ path: 'customerId' });
  } else {
    next(errorResponse(404, '無此消費者ID: ' + customerId));
    return;
  }

  const resProduct = await ProductModel.findOne({ _id: productId });
  if (resProduct) {
    await result.populate({
      path: 'productId'
    });
  } else {
    next(errorResponse(404, '無此商品ID: ' + productId));
    return;
  }

  const resOrder = await OrderModel.findOne({ _id: orderId });
  if (resOrder) {
    await result.populate({
      path: 'orderId'
    });
  } else {
    next(errorResponse(404, '無此訂單ID: ' + orderId));
    return;
  }

  res.status(200).json(
    successResponse({
      message: '建立評論成功',
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