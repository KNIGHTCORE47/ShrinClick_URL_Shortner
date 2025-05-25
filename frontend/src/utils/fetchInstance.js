export async function fetchInstance(endpoint, options = {}, baseAPI = 'auth') {
    const baseURL = import.meta.env.VITE_SERVER_URL

    // NOTE - Check for empty endpoint
    if (!baseURL) throw new Error('VITE_SERVER_URL is not defined');


    const apiEndpoints = `${baseURL}/api/${baseAPI}/${endpoint}`;

    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    };

    const response = await fetch(apiEndpoints, defaultOptions);

    // NOTE - Check for invalid fetch response [response interceptor]
    if (!response.ok) {
        let errorMessage = 'Something went wrong. Please try again.'
        let errorResponse = {}


        try {
            errorResponse = await response.json();

        } catch {
            // NOTE - Set error message if response is not JSON
            errorResponse = {
                message: response.message || response.statusText
            }
        }

        // NOTE - Set error message [status code based]
        switch (response.status) {
            case 400:
                errorMessage = errorResponse?.message || "Bad request";
                break;
            case 401:
                errorMessage = errorResponse?.message || "Unauthorized";
                break;
            case 403:
                errorMessage = errorResponse?.message || "Forbidden";
                break;
            case 404:
                errorMessage = errorResponse?.message || "Resource not found";
                break;
            case 409:
                errorMessage = errorResponse?.message || "Resource already exists";
                break;
            case 500:
                errorMessage = errorResponse?.message || "Internal Server Error";
                break;
            default:
                errorMessage = errorResponse?.message || "Something went wrong. Please try again.";
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = errorResponse;
        throw error;
    }

    return response;
}