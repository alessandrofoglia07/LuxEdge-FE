import Cookies from 'js-cookie';

const generateExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
};

/** RefreshToken class (Located in cookies) */
class RefreshToken {
    /** Set `refreshToken` (cookies)
     * @important Don't use this function outside of Redux reducers
     */
    public static set(refreshToken: string) {
        Cookies.set('refresh_token', refreshToken, { expires: generateExpirationDate() }); // 30 days
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

export default RefreshToken;
