import { Schema, model, type Document } from 'mongoose';

interface IJson {
    sub: string;
    name: string;
    given_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}

export interface IUser extends Document {
    name: string;
    email: string;
    _json?: IJson;
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
