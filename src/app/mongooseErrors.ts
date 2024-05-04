import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

export const handleMongooseError: ErrorRequestHandler = (err, _req, res, _next): void => {
    if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).json({
            status: false,
            message: err.message
        });
    } else if (err instanceof mongoose.Error.CastError) {
        res.status(400).json({
            status: false,
            message: `錯誤id: ${err.value}`
        });
    } else {
        _next(err);
    }
};
