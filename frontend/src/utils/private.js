import { redirect } from '@tanstack/react-router';
import { checkAuth } from '../apis/apiCalls.js';
import { login } from '../store/slice/authSlice.js';


export async function isPublicRoute({ context }) {
    const { store, queryClient } = context;

    try {
        const data = await queryClient
            .ensureQueryData({
                queryKey: ['checkAuth'],
                queryFn: checkAuth,
                retry: false
            })

        if (data?.data) {
            // NOTE - Authenticated [Redirect User to Dashboard Page]

            // NOTE - Set Store Data and Redirect
            store.dispatch(login(data.data));

            return redirect({ to: '/dashboard' });
        }

        // NOTE - Not Authenticated [Allow User to access the route auth]
        return true;

    } catch (error) {
        // NOTE - Not Authenticated [Allow User to access the route auth]
        return true;
    }
}


export async function isPrivateRoute({ context }) {
    const { store, queryClient } = context;

    try {
        const data = await queryClient
            .ensureQueryData({
                queryKey: ['checkAuth'],
                queryFn: checkAuth,
                retry: false
            })

        if (!data?.data) return false;

        store.dispatch(login(data.data));

        const auth = store.getState().auth;

        if (!auth.isAuthenticated) return false;

        // NOTE - Authenticated [Allow User to access the route]
        return true

    } catch (error) {
        console.error(error);
        return redirect({ to: '/auth' });
    }
} 