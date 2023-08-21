import axios from 'axios';
import Cookies from 'js-cookie';
import { LoginRes, UserInfo as IUserInfo } from '@/types';

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

/** UserInfo class (Located in localStorage) */
class UserInfo {
    /** Set `UserInfo` (localStorage)
     * @important Don't use this function outside of Redux reducers
     * @param userInfo - User info
     */
    public static set(userInfo: IUserInfo) {
        localStorage.setItem('user', JSON.stringify(userInfo));
    }

    /** Get `UserInfo` (localStorage)
     * @important Don't use this function outside of Redux reducers
     */
    public static get(): IUserInfo | null {
        const userInfo = localStorage.getItem('user');
        return userInfo ? JSON.parse(userInfo) : null;
    }

    /** Remove `UserInfo` (localStorage)
     * @important Don't use this function outside of Redux reducers
     */
    public static remove() {
        localStorage.removeItem('user');
    }
}

/** AccessToken class (Located in cookies) */
class AccessToken {
    /** Set `accessToken` (cookies)
     * @param accessToken - Access token
     * @important Don't use this function outside of Redux reducers
     */
    public static set(accessToken: string) {
        Cookies.set('access_token', accessToken, { expires: new Date(Date.now() + 15 * 60 * 1000) }); // 15 minutes
    }

    /** Get `accessToken` (cookies)
     * @important Don't use this function outside of Redux reducers
     */
    public static get() {
        return Cookies.get('access_token') || null;
    }

    /** Remove `accessToken` (cookies)
     * @important Don't use this function outside of Redux reducers
     */
    public static remove() {
        Cookies.remove('access_token');
    }

    /** Refresh `accessToken` (cookies)
     * @important Don't use this function outside of Redux reducers / Interceptors
     * @param refreshToken - Refresh token (If not provided, it will be retrieved from cookies)
     * @returns New access token
     */
    public static async refresh(refreshToken?: string) {
        if (!refreshToken) {
            refreshToken = Cookies.get('refresh_token');
            if (!refreshToken) throw new Error('No refresh token');
        }
        const res = await axios.post(`${url}/refresh-token`, { refreshToken });
        return res.data.accessToken;
    }
}

/** RefreshToken class (Located in cookies) */
class RefreshToken {
    /** Set `refreshToken` (cookies)
     * @important Don't use this function outside of Redux reducers
     */
    public static set(refreshToken: string) {
        Cookies.set('refresh_token', refreshToken, { expires: 30 }); // 30 days
    }

    /** Get `refreshToken` (cookies)
     * @important Don't use this function outside of Redux reducers
     */
    public static get(): string | null {
        return Cookies.get('refresh_token') || null;
    }

    /** Remove `refreshToken` (cookies)
     * @important Don't use this function outside of Redux reducers
     */
    public static remove() {
        Cookies.remove('refresh_token');
    }
}

export { register, activateAccount, login, forgotPassword, resetPassword, UserInfo, AccessToken, RefreshToken };
