import { Customer } from '@/models/customer';
import { Schema, model, Document } from 'mongoose';

export interface DeliveryAddress {
    country: string;
    county: string;
    district: string;
    address: string;
}

export interface OrderProduct {
    productId: Schema.Types.ObjectId;
    price: number;
    quantity: number;
    productTitle: string;
    coverImg: string;
}

export interface Order extends Document {
    userId: Customer | Schema.Types.ObjectId;
    orderProductList: OrderProduct[];
    orderDate: Date;
    orderStatus: number;
    orderAmount: number;
    paymentMethod: number;
    deliveryUserName: string;
    deliveryAddress: DeliveryAddress;
    note?: string;
    deliveryDate?: Date;
    deliveryAmount: number;
    doneDate?: Date;
    deliveryEmail: string;
    deliveryPhone: string;
}

const deliveryaddressSchema = new Schema<DeliveryAddress>(
    {
        country: { type: String, required: [true, '配送地址country未填寫'] },
        county: { type: String, required: [true, '配送地址county未填寫'] },
        district: { type: String, required: [true, '配送地址district未填寫'] },
        address: { type: String, required: [true, '配送地址address未填寫'] }
    },
    { _id: false }
);

const orderProductSchema = new Schema<OrderProduct>(
    {
        productId: { type: Schema.Types.ObjectId, required: [true, '購買商品清單ID未填寫'], ref: 'product' },
        price: { type: Number, required: [true, '購買商品清單price未填寫'] },
        quantity: { type: Number, required: [true, '購買商品清單quantity未填寫'] },
        productTitle: { type: String, required: [true, '購買商品清單productTitle未填寫'] },
        coverImg: { type: String, required: [true, '購買商品清單coverImg未填寫'] }
    },
    { _id: false }
);

const orderSchema = new Schema<Order>(
    {
        userId: { type: Schema.Types.ObjectId, required: [true, '消費者ID未填寫'], ref: 'Customer' },
        orderProductList: { type: [orderProductSchema], required: [true, '購買商品清單未填寫'] },
        orderDate: { type: Date, default: Date.now },
        orderStatus: { type: Number, required: [true, '訂單狀態未填寫'], enum: [1, 2, 3, 4, 5, -1, -2, -3] },
        orderAmount: { type: Number },
        paymentMethod: { type: Number, enum: [1, 2] },
        deliveryUserName: { type: String, required: [true, '配送使用者姓名未填寫'] },
        deliveryAddress: { type: deliveryaddressSchema, required: [true, '配送地址未填寫'] },
        note: { type: String, default: '' },
        deliveryDate: { type: Date },
        deliveryAmount: { type: Number },
        doneDate: { type: Date },
        deliveryEmail: { type: String, required: [true, 'Email未填寫'] },
        deliveryPhone: { type: String, required: [true, 'Phone未填寫'] }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default model<Order>('Order', orderSchema);
