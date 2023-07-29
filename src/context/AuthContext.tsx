import React, { useState, useEffect, createContext } from 'react';
import {
    getAccessToken,
    getRefreshToken,
    login,
    setAccessToken,
    setRefreshToken,
    refreshAccessToken,
    removeAccessToken,
    removeRefreshToken,
    getUserInfo,
    setUserInfo,
    removeUserInfo,
    register
} from '@/api/authApi';
import { UserInfo, AuthContextType } from '@/types';
import { isAxiosError } from 'axios';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    userInfo: null,
    register: async () => {},
    login: async () => {},
    logout: () => {},
    loading: false
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: AuthProviderProps) => {
    const [accessToken, setAccessTokenState] = useState<string | null>(getAccessToken());
    const [userInfo, setUserInfoState] = useState<UserInfo | null>(getUserInfo());
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const storedAccessToken = getAccessToken();
        if (storedAccessToken) {
            setAccessTokenState(storedAccessToken);
        }
        if (!storedAccessToken && getRefreshToken()) {
            handleTokenRefresh();
        }

        if (!getUserInfo()) {
            handleLogout();
        }

        const onstorage = () => {
            if (!getUserInfo()) {
                handleLogout();
            }
        };

        window.addEventListener('storage', onstorage);

        const interval = setInterval(() => {
            if (!getRefreshToken()) {
                handleLogout();
            }
            handleTokenRefresh();
        }, 15 * 60 * 1000);

        return () => {
            window.removeEventListener('storage', onstorage);
            clearInterval(interval);
        };
    }, []);

    const handleRegister = async (email: string, password: string, username: string) => {
        try {
            setLoading(true);
            await register(username, email, password);
        } catch (err) {
            if (isAxiosError(err)) {
                throw err;
            } else {
                throw new Error(err as string);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            setLoading(true);
            const res = await login(email, password);
            setAccessTokenState(res.accessToken);
            setRefreshToken(res.refreshToken);
            const user: UserInfo = { userId: res.userId, email: res.email, role: res.role, username: res.username, active: res.active };
            setUserInfoState(user);
            setUserInfo(user);
        } catch (err) {
            if (isAxiosError(err)) {
                throw err;
            } else {
                throw new Error(err as string);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setAccessTokenState(null);
        removeAccessToken();
        removeRefreshToken();
        setUserInfoState(null);
        removeUserInfo();
    };

    const handleTokenRefresh = async () => {
        const storedRefreshToken = getRefreshToken();
        if (!storedRefreshToken) return;

        try {
            setLoading(true);
            const res = await refreshAccessToken(storedRefreshToken);
            setAccessTokenState(res);
            setAccessToken(res);
        } catch (err) {
            handleLogout();
            if (isAxiosError(err)) {
                throw err;
            } else {
                throw new Error(err as string);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                userInfo,
                register: handleRegister,
                login: handleLogin,
                logout: handleLogout,
                loading
            }}>
            {children}
        </AuthContext.Provider>
    );
};
