interface CustomError extends Error {
    statusCode: number;
    isOperational: boolean;
}

export const AppError = (message: string, statusCode: number) => {
    const error = new Error(message) as CustomError;
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
