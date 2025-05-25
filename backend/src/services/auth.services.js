import {
    createNewUser,
    findUserByEmail,
    findUserByEmailAndPassword
} from '../dao/user.dao.js'
import {
    ConflictError,
    NotFoundError
} from '../utility/nodeUtility.js';



export const registerUserService = async function (email, password) {
    // NOTE -Check for existing user [DB Query]
    const existingUser = await findUserByEmail(email);

    // NOTE - Check for existing user [security]
    if (existingUser) {
        throw new ConflictError('User already exists');
    }

    // NOTE - Create new user
    const user = await createNewUser(email, password);

    // NOTE - Return user
    return user;
}


export const logInUserService = async function (email, password) {
    // NOTE -Check for existing user [DB Query]
    const authenticatedUser = await findUserByEmailAndPassword(email);

    // NOTE - Compare password [Method]
    const isPasswordCorrect = await authenticatedUser.comparePassword(password);

    // NOTE - Check for correct credentials [security]
    if (!authenticatedUser || !isPasswordCorrect) {
        throw new NotFoundError('Invalid credentials. Please try again.');
    }

    // NOTE - Return user
    return authenticatedUser;
}