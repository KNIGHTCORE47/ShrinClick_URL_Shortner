import { Schema, model } from 'mongoose';

const urlSchema = new Schema({
    originalUrl: {
        type: String,
        required: [true, 'Original URL is required'],
        lowercase: true,
        trim: true
    },
    shortUrl: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

export const ShortUrl = model('ShortUrl', urlSchema);