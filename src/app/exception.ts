import type { ErrorRequestHandler, RequestHandler } from 'express';
import { handleNPMError } from './handleNPMError';
interface CustomError extends Error {
    statusCode: number;
    isOperational: boolean;
}

export const sendNotFoundError: RequestHandler = (_req, res) => {
    res.status(404).send({
        status: false,
        message: '無此路由資訊'
    });
};

export const NpmError: ErrorRequestHandler = handleNPMError;

export const catchCustomError: ErrorRequestHandler = (err: CustomError, _req, res, _next) => {
    //若已經發送給客戶端就不再發
    if (!res.headersSent) {
        const status = err.statusCode || 500;
        const message = err.message || '重大伺服器錯誤，請聯絡管理員';
        if (process.env.NODE_ENV === 'development') {
            res.status(status).send({
                status: false,
                message: message,
                stack: err.stack
            });
            return;
        }

        if (process.env.NODE_ENV === 'production') {
            res.status(status).send({
                status: false,
                message: message
            });
        }
    }
};

process.on('uncaughtException', err => {
    console.error('Uncaughted Exception!');
    console.error(err);
    process.exit(1);
});

// 未捕捉到的 catch
process.on('unhandledRejection', (reason, promise) => {
    console.error('未捕捉到的 rejection:', promise, '原因：', reason);
});
