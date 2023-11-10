import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import LuxEdge from '@/components/LuxEdgeLogo';
import { Navigate, useNavigate } from 'react-router-dom';
import Input from '@/components/CustomElements/StyledInput';
import Button from '@/components/CustomElements/StyledButton';
import { login } from '@/api/authApi';
import { setToken, setRefreshToken, setUserInfo } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { UserInfo } from '@/types';
import { isAxiosError } from 'axios';
import { motion } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import Favorites from '@/redux/persist/Favorites';
import NotificationsMenu from '@/components/NotificationsMenu';
import { addNotification } from '@/redux/slices/notificationSlice';

const LoginPage: React.FC = () => {
    const isAuth = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

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
                const notification = {
                    title: 'Error',
                    content: err.response?.data.message || 'An error occurred while logging in.',
                    severity: 'error'
                };
                dispatch(addNotification(notification));
                throw err;
            } else if (typeof err === 'string') {
                const notification = {
                    title: 'Error',
                    content: err,
                    severity: 'error'
                };
                dispatch(addNotification(notification));
                throw new Error(err);
            } else {
                const notification = {
                    title: 'Error',
                    content: 'An error occurred while logging in.',
                    severity: 'error'
                };
                dispatch(addNotification(notification));
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
            <main className='absolute left-1/2 top-1/2 flex h-min w-min -translate-x-1/2 -translate-y-1/2 items-center rounded-lg'>
                <motion.div
                    id='presentation'
                    className={`flex h-[36rem] w-96 flex-col justify-between rounded-lg rounded-r-none bg-gradient-to-br
                        from-blue-500 to-blue-700 before:absolute
                        before:h-full before:w-96 before:bg-white before:opacity-0 -md:hidden`}
                    viewport={{ once: true }}>
                    <div id='top' className='h-12 w-max px-4 py-2'>
                        <LuxEdge version='white' id='logo' className='text-4xl' />
                    </div>
                    <div id='center' className='flex h-max w-full items-center'>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: {
                                    delay: 0.5
                                }
                            }}
                            viewport={{ once: true }}
                            className='px-4 text-center text-[2.7rem] font-bold tracking-tight text-white'>
                            Welcome back.
                        </motion.h2>
                        <div
                            className='ml-auto h-0 w-0'
                            style={{ borderTop: '30px solid transparent', borderBottom: '30px solid transparent', borderRight: '30px solid rgb(255 255 255)' }}
                        />
                    </div>
                    <div id='bottom' className='h-12 w-max px-4 py-2'>
                        <p className='text-sm font-semibold text-white'>{new Date().getFullYear()} LuxEdge Furnitures.</p>
                    </div>
                </motion.div>
                <div id='form' className='flex h-[36rem] w-96 flex-col items-center rounded-lg bg-white md:rounded-l-none'>
                    <div id='top' className='py-12'>
                        <h2 className='select-none text-center text-[2.7rem] font-extrabold tracking-tight'>Login</h2>
                    </div>
                    <form autoComplete='off' spellCheck='false' onSubmit={handleLogin}>
                        <div id='center' className='mt-12 flex h-max w-full flex-col items-center gap-8'>
                            <Input type='email' placeholder='Email' name='email' value={form.email} onChange={handleChange} containerClassName='w-3/4' />
                            <div className='flex w-full flex-col items-center gap-2'>
                                <Input type='password' placeholder='Password' name='password' value={form.password} onChange={handleChange} containerClassName='w-3/4' />
                                <p className='text-sm font-semibold text-gray-500'>
                                    Forgot your password?{' '}
                                    <a className='text-primary-base hover:text-primary-hover' href='/user/forgot-password'>
                                        Reset
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div id='bottom' className='mt-16 flex w-full flex-col items-center'>
                            <Button type='submit' className='w-3/4'>
                                Login
                            </Button>
                            <p className='mt-4 text-sm font-semibold text-gray-500'>
                                New to LuxEdge?{' '}
                                <a className='text-primary-base hover:text-primary-hover' href='/register'>
                                    Register
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
            <NotificationsMenu />
        </div>
    );
};

export default LoginPage;
