import axios from 'axios';
import AccessToken from '@/redux/persist/AccessToken';
import store from '@/redux/store';
import { logout, setToken } from '@/redux/slices/authSlice';

/** Axios instance with Authorization header.
 * If the request fails with 401 status code, it tries to refresh the access token.
 * If the refresh token is expired, it logs out the user.
 * @example
 * api.get('/endpoint');
 */
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`
});

api.interceptors.request.use(async (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = store.getState().auth.refreshToken;

                const newToken = await AccessToken.refresh(refreshToken || undefined);
                store.dispatch(setToken(newToken));

                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                return api(originalRequest);
            } catch (err) {
                store.dispatch(logout());
                throw err;
            }
        }

        return Promise.reject(err);
    }
);

export default api;
