import {
    UnauthorizedError,
    NotFoundError,
    catchAsync
} from "../utility/nodeUtility.js";
import { verifyToken, verifyTokenEasy } from "../utility/jwtTokenUtility.js";
import { findUserById } from "../dao/user.dao.js";


// NOTE - Middleware [Check Auth, if not restrict access]
export const isAuthenticated = catchAsync(async function (request, response, next) {
    const token = request.cookies.accessToken;

    if (!token) {
        throw new NotFoundError('Unauthorized access. Token not found');
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        throw new UnauthorizedError('Unauthorized access. Invalid token');
    }

    // NOTE - Save the user in the request
    request.user = decoded;
    next();

})


export const isNotAuthenticated = catchAsync(async function (request, response, next) {
    const token = request.cookies.accessToken;

    if (!token) {
        return next();
    };

    try {
        const decoded = verifyTokenEasy(token);

        if (decoded) {
            // NOTE - Check for existing user [db query]
            const user = await findUserById(decoded.userId);

            // NOTE - Check for existing user [security]
            if (user) {
                request.user = decoded;
            };
        };
    } catch (error) {
        console.log('Token verification failed, Processing as unauthenticated user.', error.message);
    }

    next();
})