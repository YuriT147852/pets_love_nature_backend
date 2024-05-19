import { IUser } from '@/models/user';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;

            DATABASE: string;
            DATABASE_PASSWORD: string;

            JWT_EXPIRES_DAY: string;
            JWT_SECRET: string;

            EMAILER_USER: string;
            EMAILER_PASSWORD: string;

            GOOGLE_CLIENT_ID: string;
            GOOGLE_SECRET_KEY: string;
            GOOGLE_CAllBACK: string;

            NODE_ENV: 'development' | 'production';
        }
    }

    namespace Express {
        interface Request {
            user?: IUser | undefined;
        }
    }
}
