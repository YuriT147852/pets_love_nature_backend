import { DeliveryAddress, OrderProduct, Order } from '@/models/orders';

export interface PaymentItem {
    Email: string;
    Amt: number; //總金額
    ItemDesc: string; //商品描述
    userId: string;
    deliveryUserName: string;
    orderProductList: OrderProduct[];
    deliveryAddress: DeliveryAddress;
    deliveryPhone: string;
}

export interface ResPaymentItem {
    PayGateWay: string;
    Version: string;
    ResOrder: {
        Email: string;
        Amt: number;
        ItemDesc: string;
        userId: string;
        orderProductList: OrderProduct[];
        deliveryAddress: DeliveryAddress;
        TimeStamp: number;
        MerchantOrderNo: string;
        aesEncrypt: string;
        shaEncrypt: string;
    };
    MerchantID: string;
    NotifyUrl: string;
    ReturnUrl: string;
}

export interface IShowOrder extends Order {
    id: string;
}
