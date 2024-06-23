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
export const getFilterCommentList: RequestHandler = handleErrorAsync(async (req, res, next) => {
  const result = await CommentModel.find({ productId: req.params.productId }).populate({
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
      message: '取得商品的評論成功',
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

  if (star <= 0) {
    return next(errorResponse(404, '請給予大於 0 的評價 '));

  }
  const resCustomer = await CustomerModel.findOne({ _id: customerId });
  if (!resCustomer) {
    return next(errorResponse(404, '無此消費者ID: ' + customerId));
  }

  const resProduct = await ProductModel.findOne({ _id: productId });
  if (!resProduct) {
    return next(errorResponse(404, '無此商品ID: ' + productId));
  }

  const resOrder = await OrderModel.findOne({ _id: orderId });
  if (!resOrder) {
    return next(errorResponse(404, '無此訂單ID: ' + orderId));
  }

  // All checks passed, create the comment
  const result = await CommentModel.create({
    customerId,
    productId,
    orderId,
    star,
    comment
  });

  // Populate all necessary fields
  await result.populate({ path: 'customerId' });
  await result.populate({ path: 'productId' });
  await result.populate({ path: 'orderId' });

  res.status(200).json(
    successResponse({
      message: '建立評論成功',
      data: result,
    }),
  );
});

// 取得消費者未評論的訂單列表
export const getNoCommentOrderIdList: RequestHandler = handleErrorAsync(async (req, res, next) => {
  const { customerId } = req.params;
  let result = []
  const resOrder = await OrderModel.find({
    userId: customerId
  });
  if (resOrder.length === 0) {
    return next(errorResponse(404, '無訂單資料'));
  }

  const resComment = await CommentModel.find({
    customerId
  });
  if (resComment.length === 0) {
    result = resOrder.map(x => x._id);
    res.status(200).json(
      successResponse({
        message: '取得待評論的訂單列表',
        data: result,
      }),
    );
  }

  // 提取 resOrder 和 resComment 的 _id 和 orderId 屬性到兩個新陣列中
  const orderIds = resOrder.map(order => order._id.toString()); // 將 ObjectId 轉換為字串
  const commentOrderIds = resComment.map(comment => comment.orderId.toString()); // 將 ObjectId 轉換為字串
  // 過濾掉目前訂單中 已評論過的訂單
  const filteredOrderIds = orderIds.filter(orderId => !commentOrderIds.includes(orderId));

  res.status(200).json(
    successResponse({
      message: '取得待評論的訂單列表',
      data: filteredOrderIds,
    }),
  );
});

// 取得消費者未評論的該筆訂單及商品資訊
export const getComment: RequestHandler = handleErrorAsync(async (req, res, next) => {
  const { customerId, orderId } = req.params;
  const resOrder = await OrderModel.find({
    userId: customerId, _id: orderId
  });

  if (resOrder.length === 0) {
    return next(errorResponse(404, '無訂單資料'));
  }

  res.status(200).json(
    successResponse({
      message: '成功取得評論',
      data: resOrder,
    }),
  );
});