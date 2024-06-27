import { Schema } from 'mongoose';

export interface IShowAccountStatus {
    ids: Schema.Types.ObjectId[];
    AccountStatus: number;
}

export interface IShowAccountStatusByArray {
    id: Schema.Types.ObjectId;
    AccountStatus: number;
}
