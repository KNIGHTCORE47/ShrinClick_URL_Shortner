import { nanoid } from 'nanoid';
import 'dotenv/config';


// NOTE - Async handler [High Order Function] [Middleware]
export function catchAsync(fn) {
    return function (request, response, next) {
        Promise
            .resolve(fn(request, response, next))
            .catch(next);
    }
}


// NOTE - Generate NanoId with atomic counter [Method]
export function generateNanoId(length = 7) {
    return nanoid(length);
};


// NOTE - Custom Error Class [Parent Class]
class APIError extends Error {
    statusCode;
    isOperational;

    constructor(
        message,
        statusCode = 500,
        isOperational = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends APIError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

class ConflictError extends APIError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}

class BadRequestError extends APIError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

class UnauthorizedError extends APIError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

class DatabaseError extends APIError {
    constructor(message = "Database operation failed") {
        super(message, 503);
    }
}


// NOTE - Error Handler [Middleware]
export function catchError(
    error, request, response, next
) {
    const isDev = process.env.NODE_ENV === 'development';


    if (error instanceof APIError) {
        return response
            .status(error.statusCode)
            .json({
                success: false,
                message: error.message,
                ...(isDev && { stack: error.stack })
            });
    }

    return response
        .status(500)
        .json({
            success: false,
            message: error.message || 'Internal Server Error',
            ...(isDev && { stack: error.stack })
        });
}

export {
    APIError,
    NotFoundError,
    ConflictError,
    BadRequestError,
    UnauthorizedError,
    DatabaseError
}