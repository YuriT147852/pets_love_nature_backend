import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import '@/app/connection';

import Routes from '@/routes';
import * as exception from '@/utils/errorHandler';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use('/public', express.static('public'));
app.use(Routes);

app.use(exception.sendNotFoundError);
app.use(exception.NpmError);
app.use(exception.catchGlobalError);
app.use(exception.catchCustomError);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});
