import type { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import CommentModel from '@/models/comment';
import CustomerModel from '@/models/customer';
import OrderModel from '@/models/orders';
import ProductModel, { IProduct } from '@/models/product';
import ProductSpecModel from '@/models/productSpec';
import { Schema } from 'mongoose';


// 取得所有商品的評價
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
    next(errorResponse(404, '無評價資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得所有商品的評價成功',
      data: result,
    }),
  );
});

// 取得單一商品資訊的評價
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
    next(errorResponse(404, '無評價資料'));
    return;
  }
  res.status(200).json(
    successResponse({
      message: '取得商品的評價成功',
      data: result,
    }),
  );
});

// 新增評價
export const createComment: RequestHandler = handleErrorAsync(async (req, res, next) => {
  const { customerId,
    productId,
    orderId,
    star, quantity,
    comment } = req.body;

  if (star <= 0) {
    return next(errorResponse(404, '請給予大於 0 的評價 '));
  }

  // 訂單不可重複評價
  const resComment = await CommentModel.findOne({ orderId, productId });
  if (resComment) {
    return next(errorResponse(404, '不可重複評價同筆訂單商品, 已建立評價ID: ' + resComment._id));
  }

  const resCustomer = await CustomerModel.findOne({ _id: customerId });
  if (!resCustomer) {
    return next(errorResponse(404, '無此消費者ID: ' + customerId));
  }

  const resOrder = await OrderModel.findOne({ _id: orderId });
  if (!resOrder) {
    return next(errorResponse(404, '無此訂單ID: ' + orderId));
  }

  let productInfoId: string | Schema.Types.ObjectId | IProduct;
  const resProduct = await ProductModel.findOne({ _id: productId });
  if (!resProduct) {
    const resProductSpec = await ProductSpecModel.findOne({ _id: productId }).exec();
    if (!resProduct) {
      return next(errorResponse(404, '無此商品資訊及規格ID: ' + productId));
    }
    productInfoId = resProductSpec.productId;
  }
  productInfoId = resProduct._id;

  // All checks passed, create the comment
  const resCreateComment = await CommentModel.create({
    customerId,
    productId: productInfoId,
    orderId,
    star,
    comment
  });
  if (!resCreateComment) {
    return next(errorResponse(404, '商品評論建立失敗，商品資訊ID: ' + productInfoId + " / 訂單ID" + orderId));
  }

  // 統計評價的分數去更新商品的評分(star)欄位
  const productInfo = await ProductModel.findById(productInfoId).exec(); // 查找当前商品的评分和销售量
  const currentQuantity = quantity;
  const currentStar = star;
  const salesVolume = productInfo.salesVolume;
  const historyStar = productInfo.star;

  // 计算新的评分
  const newStar = ((historyStar * salesVolume) + (currentStar * currentQuantity)) / (salesVolume + currentQuantity);

  await ProductModel.findByIdAndUpdate(productInfoId, {
    star: newStar,
  }).exec();

  res.status(200).json(
    successResponse({
      message: '建立評價成功, 商品資訊ID: ' + productInfoId,
    }),
  );
});

// 取得消費者未評價的訂單列表
export const getNoCommentOrderIdList: RequestHandler = handleErrorAsync(async (req, res, next) => {
  const { customerId } = req.params;
  let result = []
  // 訂單狀態要大於等於  已取貨，待評價 4 才可以被評價
  const resOrder = await OrderModel.find({
    userId: customerId, orderStatus: { $gte: 4 }
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
        message: '取得待評價的訂單列表',
        data: result,
      }),
    );
  }

  // 提取 resOrder 和 resComment 的 _id 和 orderId 屬性到兩個新陣列中
  const orderIds = resOrder.map(order => order._id.toString()); // 將 ObjectId 轉換為字串
  const commentOrderIds = resComment.map(comment => comment.orderId.toString()); // 將 ObjectId 轉換為字串

  // 過濾掉目前訂單中 已評價過的訂單
  const filteredOrderIds = orderIds.filter(orderId => !commentOrderIds.includes(orderId));

  res.status(200).json(
    successResponse({
      message: '取得待評價的訂單列表',
      data: filteredOrderIds,
    }),
  );
});

// 取得消費者未評價的該筆訂單及商品資訊
export const getNoComment: RequestHandler = handleErrorAsync(async (req, res, next) => {
  const { customerId, orderId } = req.params;
  const resOrder = await OrderModel.find({
    userId: customerId, _id: orderId
  });

  if (resOrder.length === 0) {
    return next(errorResponse(404, '無訂單資料'));
  }

  res.status(200).json(
    successResponse({
      message: '成功取得評價',
      data: resOrder,
    }),
  );
});

export const getCommentByCustomerId: RequestHandler = handleErrorAsync(async (req, res, next) => {
  const { customerId } = req.params;
  const resComment = await CommentModel.find({
    customerId
  }).populate({
    path: 'productId',
    select: 'title subtitle star category otherInfo imageGallery'
  }).populate({
    path: 'customerId',
    select: 'customerName image email'
  });

  if (resComment.length === 0) {
    return next(errorResponse(404, '無評價資料'));
  }

  res.status(200).json(
    successResponse({
      message: '成功取得該顧客的歷史商品評價，顧客ID: ' + customerId,
      data: resComment,
    }),
  );
});