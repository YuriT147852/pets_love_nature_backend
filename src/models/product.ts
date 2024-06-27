import { Schema, model, type Document } from 'mongoose';
import otherInfoSchema, { IOtherInfo } from './schema/otherInfo';
import imageGallerySchema, { IImageGallery } from './schema/imageGallery';

export interface IProduct extends Document {
  productId: string;
  title: string;
  subtitle: string;
  description: string;
  star: number;
  productNumber: string;
  category: string[];
  otherInfo: IOtherInfo[];
  imageGallery: IImageGallery[];
  salesVolume: number;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, '商品標題 未填寫'],
    },
    subtitle: {
      type: String
    },
    description: {
      type: String
    },
    star: {
      type: Number,
      default: 0
    },

    productNumber: {
      type: String
    },
    category: {
      type: [String]
    },
    otherInfo: {
      type: [otherInfoSchema]
    },
    imageGallery: {
      type: [imageGallerySchema]
    },
    salesVolume: {
      type: Number,
      default: 0
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default model('product', productSchema);
