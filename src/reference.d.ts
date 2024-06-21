import { IUser } from '@/models/user';
import { any } from 'joi';

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
            GOOGLE_CAllBACK_LOCAL: string;
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
            FIREBASE_PRIVATE_KEY_ID: string;

            JWt_BACK_SECRET: string;

            //金流
            MerchantID: string;
            HASHKEY: string;
            HASHIV: string;
            Version: string;
            ReturnUrl: string;
            NotifyUrl: string;
            PayGateWay: string;

            //Ai
            OPEN_AI_API_KEY: string;

            NODE_ENV: 'development' | 'production';
        }
    }

    namespace Express {
        interface Request {
            user?: IUser | undefined;
        }
    }

    namespace Express {
        namespace Multer {
            /** Object containing file metadata and access information. */
            interface File {
                /** Name of the form field associated with this file. */
                fieldname: string;
                /** Name of the file on the uploader's computer. */
                originalname: string;
                /**
                 * Value of the `Content-Transfer-Encoding` header for this file.
                 * @deprecated since July 2015
                 * @see RFC 7578, Section 4.7
                 */
                encoding: string;
                /** Value of the `Content-Type` header for this file. */
                mimetype: string;
                /** Size of the file in bytes. */
                size: number;
                /**
                 * A readable stream of this file. Only available to the `_handleFile`
                 * callback for custom `StorageEngine`s.
                 */
                stream: Readable;
                /** `DiskStorage` only: Directory to which this file has been uploaded. */
                destination: string;
                /** `DiskStorage` only: Name of this file within `destination`. */
                filename: string;
                /** `DiskStorage` only: Full path to the uploaded file. */
                path: string;
                /** `MemoryStorage` only: A Buffer containing the entire file. */
                buffer: Buffer;
            }
        }

        interface Request {
            /** `Multer.File` object populated by `single()` middleware. */
            file?: Multer.File | undefined;
            /**
             * Array or dictionary of `Multer.File` object populated by `array()`,
             * `fields()`, and `any()` middleware.
             */
            files?:
            | {
                [fieldname: string]: Multer.File[];
            }
            | Multer.File[]
            | undefined;
        }
    }
}
