import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import Routes from '@/routes';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as exception from '@/app/exception';

import indexRouter from './../routes/index';
// import { isErrored } from 'nodemailer/lib/xoauth2'; 先註解測試Render部屬

//  資料庫連線
const { DATABASE, DATABASE_PASSWORD } = process.env;

mongoose.set('strictQuery', false);
//大頭測試2
mongoose
    .connect(DATABASE?.replace('<password>', `${DATABASE_PASSWORD}`))
    .then(() => {
        console.log('mongodb 連線成功');
    })
    .catch((error: Error) => {
        console.log('mongodb 連線錯誤', error.message);
    });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use('/public', express.static('public'));
app.use(Routes);

app.use(exception.sendNotFoundError);
app.use(exception.catchCustomError);

app.use('/', indexRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});
