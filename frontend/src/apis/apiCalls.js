import { fetchInstance } from '../utils/fetchInstance.js';

// NOTE - Short URL APIs
export function fetchShortUrl(url) {
    return fetchInstance('create', {
        method: 'POST',
        body: JSON.stringify({
            originalUrl: url.trim()
        })
    }, 'v1');
}

// NOTE - Auth APIs
export function checkAuth() {
    return fetchInstance('register', {
        method: 'GET',
    });
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