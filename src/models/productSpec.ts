import { Schema, model, type Document } from 'mongoose';

export interface IProductSpec extends Document {
  productId: Schema.Types.ObjectId;
  productNumber: string;
  weight: number;
  price: number;
  inStock: number;
  onlineStatus: boolean;
  onlineDate: Date;
  isValid: boolean; // 若刪除商品規格則顯示false
}

const productSpecSchema = new Schema<IProductSpec>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: [true, '商品資訊ID 未填寫']
    },
    productNumber: {
      type: String
    },
    weight: {
      type: Number,
      required: [true, '商品重量 未填寫']
    },
    price: {
      type: Number,
      required: [true, '商品價格 未填寫']
    },
    inStock: {
      type: Number,
      default: 0
    },
    onlineStatus: {
      type: Boolean,
      default: false
    },
    onlineDate: {
      type: Date,
    },
    isValid: {
      type: Boolean,
      default: true
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default model<IProductSpec>('productSpec', productSpecSchema);
