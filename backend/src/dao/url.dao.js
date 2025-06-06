import { ShortUrl as urlModel } from '../models/url.models.js';
import { ConflictError } from '../utility/nodeUtility.js';


export const saveShortUrl = async function (url, randomStringOfShortUrl, userId) {
    try {
        const newUrl = new urlModel({
            originalUrl: url,
            shortUrl: randomStringOfShortUrl
        });

        // NOTE - Check for Authenitated User [if authenticated, save user id]
        if (userId) newUrl.userId = userId

        const savedUrl = await newUrl.save()

        return savedUrl;
    } catch (error) {
        console.log('Failed to save in database', error.message);

        // NOTE - Check for Duplicate Short URL
        if (error.code === 11000) {
            if (error.message.includes('shortUrl')) {
                throw new ConflictError('Short URL already exists');
            }

            if (error.message.includes('originalUrl')) {
                throw new ConflictError('Original URL already exists');
            }

        }

        throw error;
    }
}


export const redirectFromShortUrlDao = async function (id) {
    // NOTE - Find and update Short URL [DB Query]
    const urlResponse = await urlModel.findOneAndUpdate({ shortUrl: id }, {
        $inc: { clicks: 1 }
    }, { new: true });

    return urlResponse
}

export const findShortUrlBySlug = async function (slug) {
    return await urlModel.findOne({
        shortUrl: slug
    });
}

export const getAllUrlsByUserId = async function (userId) {
    return await urlModel.find({ userId });
}