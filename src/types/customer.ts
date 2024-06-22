import { Schema } from 'mongoose';

export interface IShowAccountStatus {
    ids: Schema.Types.ObjectId[];
    AccountStatus: number;
}
