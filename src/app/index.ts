import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import Routes from '@/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/public', express.static('public'));
app.use(Routes);

const port = process.env.PORT || 3000; // 測試push

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});
