import AccessToken from '@/redux/persist/AccessToken';
import useSelector from './useSelector';
import { useEffect } from 'react';
import store from '@/redux/store';
import { setToken } from '@/redux/slices/authSlice';

/**
 * Hook to check if the user is authenticated. Also refreshes the access token if it is expired.
 * @returns `true` if the user is authenticated, `false` otherwise
 */
const useAuth = () => {
    const { refreshToken, userInfo, accessToken } = useSelector((state) => state.auth);

    useEffect(() => {
        (async () => {
            if (refreshToken && (!userInfo || !accessToken)) {
                const newAccessToken: string = await AccessToken.refresh(refreshToken);
                store.dispatch(setToken(newAccessToken));
            }
        })();
    }, [accessToken]);

    return !!refreshToken && !!userInfo;
};

export default useAuth;
