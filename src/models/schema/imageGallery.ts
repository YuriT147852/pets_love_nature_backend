import { Schema } from 'mongoose';
import validator from 'validator';

export interface IImageGallery {
    imgUrl: string;
    altText: string;
}

const imageGallerySchema = new Schema<IImageGallery>(
    {
        imgUrl: {
            type: String,
            trim: true,
            validate: {
                validator(value: string) {
                    return validator.isURL(value, { protocols: ['https'] });
                },
                message: 'imageGallery 格式不正確'
            }
        },
        altText: {
            type: String,
        }
    },
    // {
    //     _id: false
    // }
);

export default imageGallerySchema;
