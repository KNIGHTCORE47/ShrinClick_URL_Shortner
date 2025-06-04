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

// NOTE - Auth APIs
export async function checkAuth() {
    const response = await fetchInstance('check-auth', {
        method: 'GET',
    });

    return await response.json();
}

export async function registerUser(email, password) {
    const response = fetchInstance('register', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });

    return await response.json();
}
export async function loginUser(email, password) {
    const response = fetchInstance('login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });

    return await response.json();
}
export function logoutUser() {
    return fetchInstance('logout', {
        method: 'POST',
    });
}