import {
    saveShortUrl,
    redirectFromShortUrl,
    findShortUrlBySlug
} from '../dao/url.dao.js';
import {
    generateNanoId,
    DatabaseError,
    NotFoundError,
    ConflictError
} from "../utility/nodeUtility.js";
import 'dotenv/config';




const BASE_URL = `${process.env.BASE_URL}/api/v1/`;

export async function createShortUrlService(url) {
    const randomStringOfShortUrl = generateNanoId(8);

    const response = await saveShortUrl(url, randomStringOfShortUrl);

    // NOTE - Check for Empty Response
    if (!response) {
        throw new DatabaseError('Failed to save in database');
    }

    const shortUrl = BASE_URL + randomStringOfShortUrl;

    return shortUrl;
}


export async function createShortUrlServiceWithUserId(url, userId, slug = null) {

    const randomStringOfShortUrl = slug ? slug : generateNanoId(8);

    const existedShortUrl = await findShortUrlBySlug(slug);

    if (existedShortUrl) {
        throw new ConflictError('Short URL already exists');
    }

    const response = await saveShortUrl(url, randomStringOfShortUrl, userId);

    // NOTE - Check for Empty Response
    if (!response) {
        throw new DatabaseError('Failed to save in database');
    }

    const shortUrl = BASE_URL + randomStringOfShortUrl;

    return shortUrl;
}


export async function redirectFromShortUrlService(id) {
    const url = await redirectFromShortUrl(id);

    // NOTE - Check for valid Short URL [security]
    if (!url) {
        throw new NotFoundError('Invalid Short URL');
    }

    // NOTE - Check for 'http://' or 'https://' prefix
    let redirectURL = url.originalUrl

    if (!url.originalUrl.startsWith('http://') && !url.originalUrl.startsWith('https://')) {
        redirectURL = `https://${url.originalUrl}`
    }

    return redirectURL;
}