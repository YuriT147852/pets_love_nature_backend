import { Schema, model, type Document } from 'mongoose';

export interface IBanner extends Document {
    ImgUrl: string;
    hyperlink: string;
    title: string;
    subtitle: string
};

const bannerSchema = new Schema<IBanner>({
    ImgUrl: {
        type: String,
        require: [true, "圖片網址未填寫"]
    },
    hyperlink: {
        type: String,
        require: [true, "超連結網址未填寫"]
    },
    title: {
        type: String,
        require: [true, "大標題未填寫"]
    },
    subtitle: {
        type: String,
        require: [true, "小標題未填寫"]
    }
},{
    versionKey: false,
})

export default model('banner', bannerSchema);

