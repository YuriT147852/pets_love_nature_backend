import { Schema } from 'mongoose';

export interface IImageGallery {
    imgUrl: string;
    altText: string;
}

const imageGallerySchema = new Schema<IImageGallery>(
    {
        imgUrl: {
            type: String,
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
