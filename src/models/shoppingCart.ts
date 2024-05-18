import { Schema, model, type Document } from 'mongoose';

export interface IShoppingCart extends Document {
  shoppingCartId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  shoppingCart: Array<IProductInCart>
}

interface IProductInCart {
  productId: Schema.Types.ObjectId;
  productSpec: Schema.Types.ObjectId;
  quantity: number;
  isChoosed: boolean;
}


const productInCart = new Schema<IProductInCart>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: [true, 'product需要的id未填寫']
    },
    quantity: {
      type: Number,
      required: [true, "數量未填寫"]
    },
    isChoosed: {
      type: Boolean,
      default: false
    },
    productSpec: {
      type: Schema.Types.ObjectId,
      ref: "productSpec",
      required: [true, "productSpec需要的id未填寫"]
    }
  },
  { _id: false }
)

const shoppingCartSchema = new Schema<IShoppingCart>(
  {
    shoppingCartId: {
      type: Schema.Types.ObjectId,
    },
    customerId: {
      type: Schema.Types.ObjectId,
    },
    shoppingCart:[productInCart],
  },
  {
    versionKey: false,
    timestamps: true
  },
);

export default model('shoppingcart', shoppingCartSchema);
