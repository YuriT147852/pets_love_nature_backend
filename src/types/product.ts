import { IProduct } from '@/models/product';
import { IProductSpec } from '@/models/productSpec';

export interface ICreateProduct extends IProduct {
  productSpecList: [IProductSpec]
}