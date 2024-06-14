import { IProduct } from '@/models/product';
import { IProductSpec } from '@/models/productSpec';
import { IImageGallery } from '@/models/schema/imageGallery';
import { IOtherInfo } from '@/models/schema/otherInfo';

export interface ICreateProduct extends IProduct {
  productSpecList: [IProductSpec]
}

export interface IShowProduct {
  title: string;
  subtitle: string;
  description: string;
  star: number;
  productNumber: string;
  category: string[];
  otherInfo: IOtherInfo[];
  imageGallery: IImageGallery[];
  productSpecList: IProductSpec[];
}