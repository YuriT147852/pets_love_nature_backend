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

            FIREBASE_TYPE: string;
            FIREBASE_PROJECT_ID: string;
            FIREBASE_PRIVATE_KEY: string;
            FIREBASE_CLIENT_EMAIL: string;
            FIREBASE_CLIENT_ID: string;
            FIREBASE_AUTH_URI: string;
            FIREBASE_TOKEN_URI: string;
            FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string;
            FIREBASE_CLIENT_X509_CERT_URL: string;

            NODE_ENV: 'development' | 'production';
        }
    }

    namespace Express {
        interface Request {
            user?: IUser | undefined;
        }
    }
}
