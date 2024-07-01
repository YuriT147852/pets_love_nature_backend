import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

export const handleNPMError: ErrorRequestHandler = (err, _req, res, next): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.message === 'Passport authentication error') {
        res.status(401).json({
            message: 'code 參數錯誤',
            status: 'false'
        });
        return;
    } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).json({
            status: 'false',
            message: err.message
        });
        return;
    } else if (err instanceof mongoose.Error.CastError) {
        res.status(400).json({
            status: 'false',
            message: err.message
        });
        return;
    } else {
        next(err);
    }
};
