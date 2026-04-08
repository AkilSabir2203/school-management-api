import { StatusCodes } from "http-status-codes";

const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = StatusCodes.NOT_FOUND;
    return next(error);
};

const globalErrorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || error.status || StatusCodes.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal server error"
    });
};

export { globalErrorHandler, notFound };