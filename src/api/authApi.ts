import axios from 'axios';
import Cookies from 'js-cookie';
import { LoginRes, UserInfo } from '@/types';

const url = `${import.meta.env.VITE_API_URL}/api/user`;

/** Register function */
const register = async (username: string, email: string, password: string): Promise<string> => {
    const res = await axios.post(`${url}/register`, { username, email, password });
    return res.data.message;
};

/** Activate account */
const activateAccount = async (userId: string): Promise<string> => {
    const res = await axios.post(`${url}/activate/${userId}`);
    return res.data.message;
};

/** Login function */
const login = async (email: string, password: string): Promise<LoginRes> => {
    const res = await axios.post(`${url}/login`, { email, password });

    if (res.status === 200) {
        return res.data;
    } else {
        throw new Error(res.data.message);
    }
};

/** Refresh token */
const refreshAccessToken = async (refreshToken: string): Promise<string> => {
    const res = await axios.post(`${url}/refresh-token`, { refreshToken });
    return res.data.accessToken;
};

/** Forgot password */
const forgotPassword = async (email: string): Promise<string> => {
    const res = await axios.post(`${url}/forgot-password`, { email });
    return res.data.message;
};

/** Reset password */
const resetPassword = async (userId: string, password: string): Promise<string> => {
    const res = await axios.post(`${url}/reset-password/${userId}`, { password });
    return res.data.message;
};

/** Set user info */
const setUserInfo = (userInfo: UserInfo) => {
    localStorage.setItem('user', JSON.stringify(userInfo));
};

/** Get user info */
const getUserInfo = (): UserInfo | null => {
    const userInfo = localStorage.getItem('user');
    return userInfo ? JSON.parse(userInfo) : null;
};

/** Remove user info */
const removeUserInfo = () => {
    localStorage.removeItem('user');
};

/** Set access token */
const setAccessToken = (accessToken: string) => {
    Cookies.set('access_token', accessToken, { expires: new Date(Date.now() + 15 * 60 * 1000) }); // 15 minutes
};

/** Get access token */
const getAccessToken = (): string | null => {
    return Cookies.get('access_token') || null;
};

/** Remove access token */
const removeAccessToken = () => {
    Cookies.remove('access_token');
};

/** Set refresh token */
const setRefreshToken = (refreshToken: string) => {
    Cookies.set('refresh_token', refreshToken, { expires: 30 }); // 30 days
};

/** Get refresh token */
const getRefreshToken = (): string | null => {
    return Cookies.get('refresh_token') || null;
};

/** Remove refresh token */
const removeRefreshToken = () => {
    Cookies.remove('refresh_token');
};

export {
    register,
    activateAccount,
    login,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    setUserInfo,
    getUserInfo,
    removeUserInfo,
    setAccessToken,
    getAccessToken,
    removeAccessToken,
    setRefreshToken,
    getRefreshToken,
    removeRefreshToken,
};
