import { Schema, model, type Document } from 'mongoose';

interface DeliveryAddress {
    country: string | null;
    county: string | null;
    district: string | null;
    address: string | null;
}

export interface Customer extends Document {
    // 收件人姓名
    recipientName: string;
    recipientAddress: DeliveryAddress;
    recipientPhone: string;
    // 顧客姓名, 第三方傳入
    customerName: string;
    deliveryAddress: DeliveryAddress;
    phone: string;
    email: string;
    image: string;
    accountStatus: number; // 會員狀態(是否黑名單)
}

const deliveryAddressSchema = new Schema<DeliveryAddress>(
    {
        country: { type: String, default: null },
        county: { type: String, default: null },
        district: { type: String, default: null },
        address: { type: String, default: null }
    },
    { _id: false }
);

const customerSchema = new Schema<Customer>(
    {
        recipientName: {
            type: String,
            default: null
        },
        recipientPhone: {
            type: String,
            default: null
        },
        recipientAddress: {
            type: deliveryAddressSchema,
            default: {
                country: null,
                county: null,
                district: null,
                address: null
            }
        },
        phone: {
            type: String,
            default: null
        },
        deliveryAddress: {
            type: deliveryAddressSchema,
            default: {
                country: null,
                county: null,
                district: null,
                address: null
            }
        },
        email: {
            type: String,
            required: [true, '使用者email未填寫'],
            unique: true
        },
        customerName: {
            type: String,
            default: null
        },
        image: {
            type: String,
            required: [false, '使用者大頭照未填寫']
        },
        accountStatus: {
            type: Number,
            default: 1
        }
    },
    {
        versionKey: false,
        timestamps: true // 自動生成創立跟更新時間
    }
);

export default model<Customer>('Customer', customerSchema);
