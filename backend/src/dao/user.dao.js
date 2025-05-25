import { User as userModel } from '../models/user.models.js';

export const createNewUser = async function (email, password) {
    const newUser = new userModel({
        email,
        password
    });
    await newUser.save();
    return newUser;
}


export const findUserByEmail = async function (email) {
    const user = await userModel.findOne({ email: email.toLowerCase() });
    return user;
}

export const findUserByEmailAndPassword = async function (email) {
    const user = await userModel.findOne({
        email: email.toLowerCase()
    }).select('+password');
    return user;
}

export const findUserById = async function (id) {
    return await userModel.findById(id);
}
