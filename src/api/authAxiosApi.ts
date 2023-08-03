import axios from 'axios';
import { getAccessToken, getRefreshToken, refreshAccessToken, setAccessToken } from './authApi';

const authAxios = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

authAxios.interceptors.request.use(async (config) => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (refreshToken && !accessToken) {
        try {
            const accessToken = await refreshAccessToken(refreshToken);
            setAccessToken(accessToken);
            config.headers.Authorization = `Bearer ${accessToken}`;
        } catch (err) {
            console.log(err);
        }
    }

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export default authAxios;