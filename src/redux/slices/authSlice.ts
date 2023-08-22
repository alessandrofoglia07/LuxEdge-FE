import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo as IUserInfo } from '@/types';
import UserInfo from '../persist/UserInfo';
import AccessToken from '../persist/AccessToken';
import RefreshToken from '../persist/RefreshToken';

interface AuthState {
    userInfo: IUserInfo | null;
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    userInfo: UserInfo.get(),
    accessToken: AccessToken.get(),
    refreshToken: RefreshToken.get()
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /** Set accesstoken */
        setToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            AccessToken.set(action.payload);
        },
        /** Set user info */
        setUserInfo: (state, action: PayloadAction<IUserInfo>) => {
            state.userInfo = action.payload;
            UserInfo.set(action.payload);
        },
        /** Set refreshtoken */
        setRefreshToken: (state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
            RefreshToken.set(action.payload);
        },
        /** Logout */
        logout: (state) => {
            state.userInfo = null;
            state.accessToken = null;
            state.refreshToken = null;
            UserInfo.remove();
            AccessToken.remove();
            RefreshToken.remove();
        }
    }
});

export const { setToken, setUserInfo, setRefreshToken, logout } = authSlice.actions;

export default authSlice.reducer;
