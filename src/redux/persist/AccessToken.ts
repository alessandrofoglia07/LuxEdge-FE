import Cookies from 'js-cookie';
import axios from 'axios';

const url = `${import.meta.env.VITE_API_URL}/api/user`;

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

export default AccessToken;
