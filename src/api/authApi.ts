import axios from 'axios';
import { LoginRes } from '@/types';

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
const resetPassword = async (userId: string, token: string, password: string): Promise<string> => {
    const res = await axios.post(`${url}/reset-password/${userId}/${token}`, { password });
    return res.data.message;
};

export { register, activateAccount, login, forgotPassword, resetPassword };
