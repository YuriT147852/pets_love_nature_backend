import { Schema, model, type Document } from 'mongoose';
import otherInfoSchema, { IOtherInfo } from './schema/otherInfo';
import imageGallerySchema, { IImageGallery } from './schema/imageGallery';

export interface IProduct extends Document {
  title: string;
  subtitle: string;
  description: string;
  star: number;
  productNumber: string;
  category: string[];
  otherInfo: IOtherInfo[];
  imageGallery: IImageGallery[];
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
      type: Number
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
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default model('product', productSchema);
