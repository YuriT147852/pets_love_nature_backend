import { Schema } from 'mongoose';

export interface IOtherInfo {
    infoName: string;
    infoValue: string;
}

const otherInfoSchema = new Schema<IOtherInfo>(
    {
        infoName: {
            type: String,
            required: [true, '次規格屬性名稱未填寫']
        },
        infoValue: {
            type: String,
            required: [true, '次規格屬性值未填寫']
        }
    },
    {
        _id: false
    }
);

export default otherInfoSchema;
