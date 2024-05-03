import { Schema, model, type Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String
        },
        email: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default model('user', userSchema);
