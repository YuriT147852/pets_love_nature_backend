import type { RequestHandler } from 'express';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import ProductModel, { IProduct } from '@/models/product';
import ProductSpecModel from '@/models/productSpec';
import { ICreateProduct, IProductList, IShowProduct, IShowProductSpec } from '@/types/product';
import { PipelineStage } from 'mongoose'

interface MatchStage {
    [key: string]: {
        $regex?: RegExp;
        [key: string]: unknown;
    };
}

type SortOrder = 1 | -1;


// 不加篩選
export const getProductList: RequestHandler = handleErrorAsync(async (_req, res, next) => {
    const result = await ProductSpecModel.find({}).populate<{
        productId: IProduct
    }>("productId").exec();

    if (result.length === 0) {
        next(errorResponse(404, '無商品資料'));
        return;
    }

    // 整理資料
    const formattedResult: IProductList[] = [];
    for (let i = 0; i < result.length; i++) {
        const productSpecRes = result[i];
        const data = JSON.parse(JSON.stringify(productSpecRes))
        data["productInfoId"] = productSpecRes.productId._id; // 商品資訊ID
        data["productSpecId"] = productSpecRes._id; // 商品規格ID
        formattedResult.push(data);
    }

    res.status(200).json(
        successResponse({
            message: '取得商品資料成功',
            data: formattedResult,
        }),
    );
});

export const getProductById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const result = await ProductSpecModel.findOne({ _id: req.params.id })
        .populate({
            path: 'productId'
        }).lean(); // 使用 .lean() 提高查詢性能;

    if (!result) {
        next(errorResponse(404, '無商品資料'));
        return;
    }

    const productSpecList = await ProductSpecModel.find({ productId: result.productId });

    const productInfo = result.productId as unknown as IProduct;

    const finalResult: IShowProduct = {
        title: productInfo.title,
        subtitle: productInfo.subtitle,
        description: productInfo.description,
        star: productInfo.star,
        category: productInfo.category,
        otherInfo: productInfo.otherInfo,
        imageGallery: productInfo.imageGallery,
        productSpecList: productSpecList as IShowProductSpec[],
        productNumber: productInfo.productNumber,
        productId: productInfo._id
    };

    if (!finalResult) {
        next(errorResponse(404, '無商品資料'));
        return;
    }

    res.status(200).json(
        successResponse({
            message: '取得單一商品資料成功',
            data: finalResult,
        }),
    );
});

// 新增商品
export const createProduct: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    // 1.先建立商品訊息
    const { title, subtitle, category, otherInfo, imageGallery, description, productSpecList }: ICreateProduct = req.body;

    if (productSpecList.length > 0) {
        let totalResProductSpec = 0;
        const resultProduct = await ProductModel.create({
            title,
            subtitle, category, otherInfo,
            imageGallery, description
        });
        const productId = await resultProduct._id;

        for (let i = 0; i < productSpecList.length; i++) {
            const productNumber = productSpecList[i].productNumber;
            const weight = productSpecList[i].weight;
            const price = productSpecList[i].price;
            const inStock = productSpecList[i].inStock;
            const onlineStatus = productSpecList[i].onlineStatus;
            const onlineDate = productSpecList[i].onlineStatus ? Date.now() : ''

            // 2.建立商品規格
            const resultProductSpec = await ProductSpecModel.create({
                productId,
                productNumber,
                weight,
                price,
                inStock,
                onlineStatus,
                onlineDate
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

// 查詢前台篩選商品
export const getFilterProductList: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    const { page = 1, searchText = '', sortOrder = -1, sortBy = 'star', limit, filterCategory, onlineStatus } = req.query;

    // 默認 1 頁顯示 10 筆
    const pageSize = limit ? parseInt(limit as string, 10) : 10;
    // 跳頁
    const skip = (Number(page) - 1) * pageSize;

    // 排序
    const sortOrderNumber: SortOrder = Number(sortOrder) === -1 ? -1 : 1;
    // 依照傳入的變數置換排序項目
    let sortField: Record<string, SortOrder> = {};
    switch (sortBy) {
        case 'star':
            sortField = { 'product.star': sortOrderNumber };
            break;
        case 'price':
            sortField = { 'price': sortOrderNumber };
            break;
        case 'updatedAt':
            sortField = { 'product.updatedAt': sortOrderNumber };
            break;
        case 'salesVolume':
            sortField = { 'product.salesVolume': sortOrderNumber };
            break;
        case 'inStock':
            sortField = { 'inStock': sortOrderNumber };
            break;
    }
    sortField = Object.assign({}, sortField, { 'productId': -1 });

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
        // {
        //     $project: {
        //         productId: 0, // 排除 productId
        //     }
        // }
    ];

    // 創建一個空的 matchStage 物件
    const matchStage: MatchStage = {};
    // 如果有關鍵字，則設置匹配條件
    if (searchText) {
        const regex = new RegExp(searchText as string, 'i'); // 不区分大小写
        matchStage['product.title'] = { $regex: regex };
    }
    // 如果有分類，則也加入匹配條件
    if (filterCategory) {
        matchStage['product.category'] = { $in: [filterCategory] };
    }
    // 如果上限狀態有值
    if (onlineStatus !== undefined) {
        // console.log("0623 onlineStatus:   ", typeof onlineStatus, onlineStatus);
        const isOnline = onlineStatus === 'true';
        matchStage['onlineStatus'] = { $eq: isOnline };
        // matchStage['onlineStatus'] = { $eq: Boolean(onlineStatus) };
    }

    // 如果 matchStage 不是空對象，則添加 $match 階段
    if (Object.keys(matchStage).length > 0) {
        aggregationPipeline.push({ $match: matchStage });
    }

    // 不加入頁數先搜尋一次
    const totalResult = await ProductSpecModel.aggregate(aggregationPipeline);
    // 獲取總筆數
    const totalDocuments = totalResult.length;
    // 獲取總頁數
    const totalPages = Math.ceil(totalDocuments / pageSize);

    // 加入排序及分頁
    aggregationPipeline.push(
        { $sort: sortField },
        { $skip: skip },                   // 跳過指定數量
        { $limit: pageSize }               // 限制輸出數量
    );
    // console.log("aggregationPipeline: ", aggregationPipeline);

    const result = await ProductSpecModel.aggregate(aggregationPipeline);
    if (result.length === 0) {
        const resData = {
            content: [],
            page: {
                totalAmount: totalDocuments, // 此次搜尋全部數量
                nowPage: Number(page),
                totalPages,
                pageSize: Number(pageSize) // 一頁顯示幾筆
            }
        }

        res.status(200).json(
            successResponse({
                message: '無商品資料',
                data: resData,
            }),
        );
    }

    // 整理資料
    const formattedResult = [];
    for (let i = 0; i < result.length; i++) {
        const productSpecRes = result[i];
        const data = JSON.parse(JSON.stringify(productSpecRes))
        data["productInfoId"] = productSpecRes.productId; // 商品資訊ID
        data["productSpecId"] = productSpecRes._id; // 商品規格ID
        formattedResult.push(data);
    }

    const resData = {
        content: formattedResult,
        page: {
            totalAmount: totalDocuments, // 此次搜尋全部數量
            nowPage: Number(page),
            totalPages,
            pageSize: Number(pageSize) // 一頁顯示幾筆
        }
    }
    res.status(200).json(
        successResponse({
            message: '取得商品資料成功',
            data: resData,
        }),
    );

});

// 查詢後台篩選商品
export const getAdminProductList: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    const { page = 1, searchText = '', sortOrder = -1, sortBy, limit, filterCategory, onlineStatus } = req.query;

    // 默認 1 頁顯示 10 筆
    const pageSize = limit ? parseInt(limit as string, 10) : 10;
    // 跳頁
    const skip = (Number(page) - 1) * pageSize;

    // 排序
    const sortOrderNumber: SortOrder = Number(sortOrder) === -1 ? -1 : 1;
    // 依照傳入的變數置換排序項目
    let sortField: Record<string, SortOrder> = {};
    switch (sortBy) {
        case 'star':
            sortField = { 'product.star': sortOrderNumber };
            break;
        case 'price':
            sortField = { 'price': sortOrderNumber };
            break;
        case 'updatedAt':
            sortField = { 'product.updatedAt': sortOrderNumber };
            break;
        case 'salesVolume':
            sortField = { 'product.salesVolume': sortOrderNumber };
            break;
        case 'inStock':
            sortField = { 'inStock': sortOrderNumber };
            break;
    }
    sortField = Object.assign({}, sortField, { 'productId': -1 });

    console.log("sortField: ", sortField);


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
        // {
        //     $project: {
        //         productId: 0, // 排除 productId
        //     }
        // }
    ];

    // 創建一個空的 matchStage 物件
    const matchStage: MatchStage = {};
    // 如果有關鍵字，則設置匹配條件
    if (searchText) {
        const regex = new RegExp(searchText as string, 'i'); // 不区分大小写
        matchStage['product.title'] = { $regex: regex };
    }
    // 如果有分類，則也加入匹配條件
    if (filterCategory) {
        matchStage['product.category'] = { $in: [filterCategory] };
    }
    // 如果上限狀態有值
    if (onlineStatus !== undefined) {
        // console.log("0623 onlineStatus:   ", typeof onlineStatus, onlineStatus);
        const isOnline = onlineStatus === 'true';
        matchStage['onlineStatus'] = { $eq: isOnline };
        // matchStage['onlineStatus'] = { $eq: Boolean(onlineStatus) };
    }

    // 不加入頁數先搜尋一次
    const totalResult = await ProductSpecModel.aggregate(aggregationPipeline);

    // 如果 matchStage 不是空對象，則添加 $match 階段
    if (Object.keys(matchStage).length > 0) {
        aggregationPipeline.push({ $match: matchStage });
    }

    // 加入排序及分頁
    aggregationPipeline.push(
        { $sort: sortField },
        { $skip: skip },                   // 跳過指定數量
        { $limit: pageSize }               // 限制輸出數量
    );
    // console.log("aggregationPipeline: ", aggregationPipeline);

    const result = await ProductSpecModel.aggregate(aggregationPipeline);
    if (result.length === 0) {
        res.status(200).json(
            successResponse({
                message: '無商品資料',
                data: [],
            }),
        );
    }
    // console.log("res", result);
    // 整理資料
    const formattedResult = [];
    for (let i = 0; i < result.length; i++) {
        const productSpecRes = result[i];
        const data = JSON.parse(JSON.stringify(productSpecRes))
        data["productInfoId"] = productSpecRes.productId; // 商品資訊ID
        data["productSpecId"] = productSpecRes._id; // 商品規格ID
        formattedResult.push(data);
    }

    // 獲取總筆數
    const totalDocuments = totalResult.length;
    // 獲取總頁數
    const totalPages = Math.ceil(totalDocuments / pageSize);

    const resData = {
        content: formattedResult,
        page: {
            totalAmount: totalDocuments, // 此次搜尋全部數量
            nowPage: Number(page),
            totalPages,
            pageSize: Number(pageSize) // 一頁顯示幾筆
        }
    }
    res.status(200).json(
        successResponse({
            message: '取得商品資料成功',
            data: resData,
        }),
    );


});

// 刪除商品規格
export const deleteProductSpecById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const result = await ProductSpecModel.findByIdAndRemove(req.params.id);
    if (!result) {
        next(errorResponse(404, '商品規格不存在'));
        return;
    }

    res.status(200).json(
        successResponse({
            message: '刪除商品規格成功'
        }),
    );
});

// 更新商品資訊
export const updateProductById: RequestHandler = handleErrorAsync(async (req, res, next) => {
    let returnResult = '';
    // 取得要更新的商品資訊
    const { productId, title, subtitle, category, otherInfo, imageGallery, description, productSpecList }: ICreateProduct = req.body;
    if (productId) {
        // 更新商品資訊
        const updateProductInfo = await ProductModel.findByIdAndUpdate(
            productId,
            {
                title,
                subtitle,
                category,
                otherInfo,
                imageGallery,
                description
            },
            { new: true } // 返回更新後的文檔
        );
        returnResult = "資訊ID: " + updateProductInfo?._id;
        if (!updateProductInfo) {
            next(errorResponse(404, '欲更新的商品資訊ID不存在'));
        }

    } else {
        // 無商品資訊
        // 更新商品規格
        let hasProductSpecId = false;
        if (productSpecList && productSpecList.length > 0) {
            for (let i = 0; i < productSpecList.length; i++) {
                const { id, productNumber, weight, price, inStock, onlineStatus } = productSpecList[i];
                if (id) {
                    hasProductSpecId = true;
                    // 更新現有的商品規格
                    const uptProductSpec = await ProductSpecModel.findByIdAndUpdate(
                        id,
                        {
                            productNumber,
                            weight,
                            price,
                            inStock,
                            onlineStatus,
                            onlineDate: onlineStatus ? Date.now() : ''
                        },
                        { new: true } // 返回更新後的文檔
                    );
                    if (uptProductSpec) {
                        returnResult += "規格ID: " + uptProductSpec._id;
                    }
                    if (!uptProductSpec) {
                        next(errorResponse(404, '欲更新的商品規格不存在'));
                    }
                }
            }
        }

        if (!hasProductSpecId && !productId) {
            next(errorResponse(404, '請輸入欲更新的商品資訊 ID 或是商品規格 ID'));
        }

        res.status(200).json(
            successResponse({
                message: `成功更新商品: ${returnResult}`
            }),
        );
    }

    // 更新商品規格
    if (productSpecList && productSpecList.length > 0) {
        for (let i = 0; i < productSpecList.length; i++) {
            const { id, productNumber, weight, price, inStock, onlineStatus } = productSpecList[i];
            if (id) {
                // 更新現有的商品規格
                const uptProductSpec = await ProductSpecModel.findByIdAndUpdate(
                    id,
                    {
                        productNumber,
                        weight,
                        price,
                        inStock,
                        onlineStatus,
                        onlineDate: onlineStatus ? Date.now() : ''
                    },
                    { new: true } // 返回更新後的文檔
                );
                if (uptProductSpec) {
                    returnResult += "規格ID: " + uptProductSpec._id;
                }
                if (!uptProductSpec) {
                    next(errorResponse(404, '欲更新的商品規格ID不存在'));
                }
            }
        }
    }

    res.status(200).json(
        successResponse({
            message: `成功更新商品${returnResult}`
        }),
    );
});

// 單獨新增商品規格
export const createProductSpec: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { productId, productSpecList }: ICreateProduct = req.body;
    if (!productId) {
        next(errorResponse(404, '請填寫商品資訊ID'));
        return;
    }
    if (productSpecList.length <= 0) {
        next(errorResponse(404, '請新增商品規格'));
        return;
    }
    const resultProduct = await ProductModel.findOne({ _id: productId });
    if (!resultProduct) {
        next(errorResponse(404, '無商品資訊ID'));
        return;
    }
    let returnResult = "";
    for (let i = 0; i < productSpecList.length; i++) {
        const productNumber = productSpecList[i].productNumber;
        const weight = productSpecList[i].weight;
        const price = productSpecList[i].price;
        const inStock = productSpecList[i].inStock;
        const onlineStatus = productSpecList[i].onlineStatus;
        const onlineDate = productSpecList[i].onlineStatus ? Date.now() : ''

        // 2.建立商品規格
        const resultProductSpec = await ProductSpecModel.create({
            productId,
            productNumber,
            weight,
            price,
            inStock,
            onlineStatus,
            onlineDate
        });

        await resultProductSpec.populate({
            path: 'productId'
        });
        returnResult += resultProductSpec._id + " ";
    }

    res.status(200).json(
        successResponse({
            message: '成功建立商品規格ID: ' + returnResult + ' 成功建立 '
        }),
    );
});