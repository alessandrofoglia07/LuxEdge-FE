import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import LuxEdge from '@/components/LuxEdgeLogo';
import { Navigate, useNavigate } from 'react-router-dom';
import Input from '@/components/CustomElements/StyledInput';
import Button from '@/components/CustomElements/StyledButton';
import { login } from '@/api/authApi';
import { setToken, setRefreshToken, setUserInfo } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { UserInfo, NotificationMessage } from '@/types';
import Notification from '@/components/Notification';
import { isAxiosError } from 'axios';
import { motion } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import Favorites from '@/redux/persist/Favorites';

const LoginPage: React.FC = () => {
    const isAuth = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState<NotificationMessage>({ title: 'Unexpected error.', content: '' });

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { userId, email, username, active, role, accessToken, refreshToken } = await login(form.email, form.password);
            const userInfo: UserInfo = {
                userId: userId,
                email: email,
                username: username,
                active: active,
                role: role
            };
            dispatch(setToken(accessToken));
            dispatch(setRefreshToken(refreshToken));
            dispatch(setUserInfo(userInfo));
            if (Favorites.get().length > 0) {
                await Favorites.sync();
            }
            navigate('/products');
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setError({ ...error, content: err.response?.data.message || 'An error occurred while logging in.' });
                throw err;
            } else if (typeof err === 'string') {
                setError({ ...error, content: err });
                throw new Error(err);
            } else {
                setError({ ...error, content: 'An error occurred while logging in.' });
                console.log(err);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const body = document.querySelector('body');
        body?.classList.add('bg-slate-200');
        return () => body?.classList.remove('bg-slate-200');
    }, []);

    return isAuth ? (
        <Navigate to='/products' />
    ) : (
        <div id='LoginPage'>
            <Navbar />
            <main className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center w-min h-min rounded-lg'>
                <motion.div
                    id='presentation'
                    className={`w-96 h-[36rem] rounded-lg rounded-r-none -md:hidden bg-gradient-to-br from-blue-500 to-blue-700
                        flex flex-col justify-between
                        before:bg-white before:opacity-0 before:absolute before:w-96 before:h-full`}
                    viewport={{ once: true }}
                >
                    <div id='top' className='h-12 w-max px-4 py-2'>
                        <LuxEdge version='white' id='logo' className='text-4xl' />
                    </div>
                    <div id='center' className='h-max w-full flex items-center'>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: {
                                    delay: 0.5
                                }
                            }}
                            viewport={{ once: true }}
                            className='text-center text-[2.7rem] font-bold text-white px-4 tracking-tight'
                        >
                            Welcome back.
                        </motion.h2>
                        <div
                            className='w-0 h-0 ml-auto'
                            style={{ borderTop: '30px solid transparent', borderBottom: '30px solid transparent', borderRight: '30px solid rgb(255 255 255)' }}
                        />
                    </div>
                    <div id='bottom' className='h-12 w-max px-4 py-2'>
                        <p className='text-sm text-white font-semibold'>{new Date().getFullYear()} LuxEdge Furnitures.</p>
                    </div>
                </motion.div>
                <div id='form' className='w-96 h-[36rem] rounded-lg md:rounded-l-none bg-white flex flex-col items-center'>
                    <div id='top' className='py-12'>
                        <h2 className='font-extrabold text-center text-[2.7rem] tracking-tight select-none'>Login</h2>
                    </div>
                    <form autoComplete='off' spellCheck='false' onSubmit={handleLogin}>
                        <div id='center' className='h-max w-full flex flex-col gap-8 items-center mt-12'>
                            <Input type='email' placeholder='Email' name='email' value={form.email} onChange={handleChange} containerClassName='w-3/4' />
                            <div className='w-full flex flex-col items-center gap-2'>
                                <Input type='password' placeholder='Password' name='password' value={form.password} onChange={handleChange} containerClassName='w-3/4' />
                                <p className='text-sm text-gray-500 font-semibold'>
                                    Forgot your password?{' '}
                                    <a className='text-primary-base hover:text-primary-hover' href='/user/forgot-password'>
                                        Reset
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div id='bottom' className='w-full flex flex-col mt-16 items-center'>
                            <Button type='submit' className='w-3/4'>
                                Login
                            </Button>
                            <p className='mt-4 text-sm text-gray-500 font-semibold'>
                                New to LuxEdge?{' '}
                                <a className='text-primary-base hover:text-primary-hover' href='/register'>
                                    Register
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
            <Notification severity='error' message={error} onClose={() => setError({ ...error, content: '' })} open={error.content.length > 0} />
        </div>
    );
};

export default LoginPage;
