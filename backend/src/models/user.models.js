import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minLength: [8, 'Password must be at least 8 characters long'],
        select: false
    },
    avatar: {
        type: String,
        required: [true, 'Avatar is required'],
        default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    }
}, { timestamps: true });



// NOTE - Hash password before saving to [DB]
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
})


// NOTE - Compare password [Method]
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// NOTE - Remove user password from response

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

export const User = model('User', userSchema);