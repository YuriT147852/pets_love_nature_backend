import { RequestHandler } from 'express';

export const handleErrorAsync = function handleErrorAsync(func: RequestHandler): RequestHandler {
    return function (req, res, next) {
        Promise.resolve(func(req, res, next)).catch(function (error) {
            return next(error);
        });
    };
};
