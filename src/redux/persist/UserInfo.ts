import { UserInfo as IUserInfo } from '@/types';

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

export default UserInfo;
