import {
    BadRequestError,
    NotFoundError,
    catchAsync
} from '../utility/nodeUtility.js'
import {
    createShortUrlService,
    createShortUrlServiceWithUserId,
    redirectFromShortUrlService
} from '../services/url.services.js';
import { getAllUrlsByUserId } from '../dao/url.dao.js';


export const createShortUrl = catchAsync(async function (request, response) {
    const data = request.body;
    console.log("--- createShortUrl request body: ", data.originalUrl);


    // NOTE - Check for valid URL
    if (!data.originalUrl) {
        throw new BadRequestError('Original URL is required');
    }
    let shortUrl;

    // NOTE - Validation and non validation pathways
    if (request.user) {
        shortUrl = await createShortUrlServiceWithUserId(data.originalUrl, request.user.userId, data.slug);
    } else {
        shortUrl = await createShortUrlService(data.originalUrl);
    }


    return response
        .status(201)
        .json({
            success: true,
            message: 'Short URL created successfully',
            data: shortUrl
        });
})


export const redirectFromShortUrl = catchAsync(async function (request, response) {
    const { id } = request.params;

    // NOTE - Check for valid Short URL
    if (!id) {
        throw new BadRequestError('Short URL is required');
    }

    const redirectURL = await redirectFromShortUrlService(id);

    // NOTE - Redirect to original URL
    return response.redirect(301, redirectURL)
})


export const getAllUrls = catchAsync(async function (request, response) {
    const userId = request.user.userId;

    const urls = await getAllUrlsByUserId(userId);

    if (!urls) {
        throw new NotFoundError('No URLs found');
    }

    return response
        .status(200)
        .json({
            success: true,
            message: 'Urls fetched successfully',
            data: urls
        });

})
