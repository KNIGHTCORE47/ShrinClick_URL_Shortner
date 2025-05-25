import { catchAsync } from '../utility/nodeUtility.js';
import {
    registerUserService,
    logInUserService
} from '../services/auth.services.js';
import {
    generateToken
} from '../utility/jwtTokenUtility.js';
import {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
} from '../utility/nodeUtility.js';
import { cookieOptions } from '../constant.js';
import { findUserById } from '../dao/user.dao.js'


export const checkAuth = catchAsync(async function (request, response) {

    // NOTE - Check for authenticated user
    if (!request.user) {
        throw new UnauthorizedError('Unauthorized access. Please log in.');
    }

    // NOTE - Check for existing user [db query]
    const user = await findUserById(request.user.userId);

    // NOTE - Check for existing user [security]
    if (!user) {
        throw new NotFoundError('User not found');
    }

    // NOTE - Return user
    return response
        .status(200)
        .json({
            success: true,
            message: 'User is authenticated',
            data: user
        });
})


export const registerUserAccount = catchAsync(async function (request, response) {
    const { email, password } = request.body;

    // NOTE - Check for valid email and password
    if (!email || !password) {
        throw new BadRequestError('Email and Password are required');
    }

    // NOTE - Check for valid email
    if (!email.includes('@')) {
        throw new BadRequestError('Invalid email');
    }

    // NOTE - Check for valid password
    if (password.length < 8) {
        throw new BadRequestError('Password must be at least 8 characters long');
    }

    // NOTE - Register user account
    const user = await registerUserService(email, password);

    // NOTE - Generate JWT Token
    generateToken(response, user);

    // NOTE - Return user
    return response
        .status(201)
        .json({
            success: true,
            message: 'User registered successfully',
            data: user
        });

})

export const logInUserAccount = catchAsync(async function (request, response) {
    const { email, password } = request.body;

    // NOTE - Check for valid email and password
    if (!email || !password) {
        throw new BadRequestError('Email and Password are required');
    }

    // NOTE - Log in user account
    const user = await logInUserService(email, password);

    // NOTE - Generate JWT Token
    generateToken(response, user);

    // NOTE - Return user
    return response
        .status(200)
        .json({
            success: true,
            message: 'User logged in successfully',
            data: user
        });
})


export const logOutUserAccount = catchAsync(async function (_, response) {
    response.clearCookie('accessToken', {
        ...cookieOptions,
        maxAge: 0
    });

    return response
        .status(200)
        .json({
            success: true,
            message: 'User logged out successfully'
        });
})