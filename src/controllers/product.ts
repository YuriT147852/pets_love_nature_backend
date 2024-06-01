import type { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import ProductModel from '@/models/product';
import ProductSpecModel from '@/models/productSpec';
import { ICreateProduct } from '@/types/product';
import { PipelineStage } from 'mongoose';

interface MatchStage {
    [key: string]: {
        $regex?: RegExp;
        [key: string]: unknown;
    };
}

type SortOrder = 1 | -1;


// 不加篩選
export const getProductList: RequestHandler = handleErrorAsync(async (_req, res, next) => {
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

export const getProductById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const result = await ProductSpecModel.findOne({
        _id: req.params.id
    }).populate({
        path: 'productId',
        select: 'title subtitle description star category otherInfo imageGallery'
    });

    if (!result) {
        next(errorResponse(404, '無商品資料'));
        return;
    }

    res.status(200).json(
        successResponse({
            message: '取得單一商品資料成功',
            data: result,
        }),
    );
});

export const createOneOrder: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    // 1.先建立商品訊息
    const { title, subtitle, category, otherInfo, productSpecList }: ICreateProduct = req.body;

    if (productSpecList.length > 0) {
        let totalResProductSpec = 0;
        const resultProduct = await ProductModel.create({
            title,
            subtitle, category, otherInfo
        });
        const productId = await resultProduct._id;

        for (let i = 0; i < productSpecList.length; i++) {
            const productNumber = productSpecList[i].productNumber;
            const weight = productSpecList[i].weight;
            const price = productSpecList[i].price;
            const inStock = productSpecList[i].inStock;

            // 2.建立商品規格
            const resultProductSpec = await ProductSpecModel.create({
                productId,
                productNumber,
                weight,
                price,
                inStock
            });

            await resultProductSpec.populate({
                path: 'productId'
            });
        }
        totalResProductSpec = productSpecList.length;

        res.status(200).json(
            successResponse({
                message: '成功建立商品ID: ' + productId + ' 成功建立 ' + totalResProductSpec + ' 商品規格'
            }),
        );
    }
});

// 加篩選
export const getFilterProductList: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    const { page = 1, searchText = '', sortOrder = -1, sortBy = 'star', limit } = req.query;

    // 默認 1 頁顯示 10 筆
    const pageSize = limit ? parseInt(limit as string, 10) : 10;
    // 跳頁
    const skip = (Number(page) - 1) * pageSize;
    // 獲取總筆數
    const totalDocuments = await ProductSpecModel.countDocuments();
    // 獲取總頁數
    const totalPages = Math.ceil(totalDocuments / pageSize);

    // 排序
    const sortOrderNumber: SortOrder = sortOrder === -1 ? -1 : 1;
    // 依照傳入的變數置換排序項目
    let sortField: Record<string, SortOrder> = {};
    switch (sortBy) {
        case 'star':
            sortField = { 'products.star': sortOrderNumber };
            break;
        case 'price':
            sortField = { 'price': sortOrderNumber };
            break;
        case 'updatedAt':
            sortField = { 'updatedAt': sortOrderNumber };
            break;
        case 'productSalesQuantity':
            // todo: 計算訂單內的商品銷售數量
            // sortField = { 'updatedAt': sortOrderNumber };
            break;
        default:
            sortField = { 'inStock': sortOrderNumber };
    }

    // 關鍵字搜尋
    const matchStage: MatchStage = {};
    if (searchText) {
        const regex = new RegExp(searchText as string, 'i'); // 不区分大小写
        matchStage['products.title'] = { $regex: regex };
    }

    const aggregationPipeline: PipelineStage[] = [
        // 組裝商品資訊
        {
            $lookup: {
                from: 'products',            // 目标集合名
                localField: 'productId',     // 本集合中用于匹配的字段
                foreignField: '_id',         // 目标集合中用于匹配的字段
                pipeline: [
                    {
                        $project: {
                            _id: 0, // 排除_id字段
                        }
                    }
                ],
                as: 'product'               // 輸出名稱
            }
        },
        {
            $unwind: '$product'            // 展開成物件
        },
        {
            $project: {
                productId: 0, // 排除 productId
            }
        }
    ];
    // 如果有關鍵字 添加 $match
    if (Object.keys(matchStage).length > 0) {
        aggregationPipeline.push({ $match: matchStage });
    }

    // 加入排序及分頁
    aggregationPipeline.push(
        { $sort: sortField },
        { $skip: skip },                   // 跳過指定數量
        { $limit: pageSize }               // 限制輸出數量
    );

    const result = await ProductSpecModel.aggregate(aggregationPipeline);
    console.log("result", result);

    if (result.length === 0) {
        res.status(200).json(
            successResponse({
                message: '無商品資料',
                data: [],
            }),
        );
    }

    const resData = {
        content: result,
        page: {
            // todo: 一直顯示所有商品數量
            // totalAmount: totalDocuments,
            nowPage: Number(page),
            totalPages
        }
    }
    res.status(200).json(
        successResponse({
            message: '取得商品資料成功',
            data: resData,
        }),
    );

});

export const deleteProductSpecById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const result = await ProductSpecModel.findByIdAndRemove(req.params.id);
    if (!result) {
        next(errorResponse(404, '商品規格不存在'));
        return;
    }
    console.log("deleteProductSpecById result", result);

    res.status(200).json(
        successResponse({
            message: '刪除商品規格成功'
        }),
    );
});
