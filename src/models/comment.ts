import { Schema, model, Document } from 'mongoose';

interface IComment extends Document {
    customerId: Schema.Types.ObjectId;
    productId: Schema.Types.ObjectId;
    orderId: Schema.Types.ObjectId;
    star: number;
    comment: string;
}

const commentSchema = new Schema<IComment>(
    {
        customerId: { type: Schema.Types.ObjectId, required: [true, '消費者ID未填寫'], ref: 'Customer' },
        productId: { type: Schema.Types.ObjectId, required: [true, '商品ID未填寫'], ref: 'product' },
        orderId: { type: Schema.Types.ObjectId, required: [true, '訂單ID未填寫'], ref: 'Order' },
        star: { type: Number, required: [true, '評分未填寫'] },
        comment: { type: String },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default model<IComment>('Comment', commentSchema);
