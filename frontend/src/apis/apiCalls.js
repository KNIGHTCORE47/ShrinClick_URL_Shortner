import { fetchInstance } from '../utils/fetchInstance.js';

// NOTE - Short URL APIs
export function fetchShortUrl(url, slug = null) {
    return fetchInstance('create', {
        method: 'POST',
        body: JSON.stringify({
            originalUrl: url.trim(),
            slug
        })
    }, 'v1');
}

export async function fatchAllUrlsOfAuthUser() {
    const response = await fetchInstance('all-urls', {
        method: 'GET',
    }, 'v1');

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch URLs');
    }

    return await response.json();
}


// NOTE - Auth APIs
export async function checkAuth() {
    const response = await fetchInstance('check-auth', {
        method: 'GET',
    });

    return await response.json();
}

export function registerUser(email, password) {
    return fetchInstance('register', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });
}

export function loginUser(email, password) {
    return fetchInstance('login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });
}

export function logoutUser() {
    return fetchInstance('logout', {
        method: 'POST',
    });
}