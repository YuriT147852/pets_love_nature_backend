import { IProduct } from '@/models/product';
import { IProductSpec } from '@/models/productSpec';
import { IImageGallery } from '@/models/schema/imageGallery';
import { IOtherInfo } from '@/models/schema/otherInfo';

export interface ICreateProduct extends IProduct {
  productId: string;
  productSpecList: [IProductSpec]
}
export interface IShowProductSpec {
  id: string;
  productNumber: string;
  weight: number;
  price: number;
  inStock: number;
  onlineStatus: boolean;
  onlineDate: Date;
  isValid: boolean;
}

export interface IShowProduct {
  productId: string;
  title: string;
  subtitle: string;
  description: string;
  star: number;
  productNumber: string;
  category: string[];
  otherInfo: IOtherInfo[];
  imageGallery: IImageGallery[];
  productSpecList: IShowProductSpec[];
}

export interface IProductList extends IProductSpec {
  productInfoId: string;
  productSpecId: string;
}