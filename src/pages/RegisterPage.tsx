import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LuxEdge from '@/components/LuxEdgeLogo';
import { Navigate } from 'react-router-dom';
import Input from '@/components/CustomElements/StyledInput';
import Button from '@/components/CustomElements/StyledButton';
import { register } from '@/api/authApi';
import { z } from 'zod';
import { detect } from 'curse-filter';
import { isAxiosError } from 'axios';
import { motion } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import NotificationsMenu from '@/components/NotificationsMenu';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/slices/notificationSlice';

const bannedUsernames = ['post', 'comment', 'admin', 'administrator', 'moderator', 'mod', 'user', 'users'];

interface HelperTexts {
    username: string | undefined;
    email: string | undefined;
    password: string | undefined;
}

const userLengthErr = 'Username must be 3-20 characters long';
const userCharsErr = 'Username cannot contain spaces or asterisks';
const userNotAllowedErr = 'Username not allowed';
const passLengthErr = 'Password must be 6-16 characters long';
const passCharsErr = 'Password cannot contain spaces';

const RegisterPage: React.FC = () => {
    const isAuth = useAuth();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [helperTexts, setHelperTexts] = useState<HelperTexts>({
        username: undefined,
        email: undefined,
        password: undefined
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        validateField(e.target.name as 'username' | 'email' | 'password', e.target.value);
    };

    // validate the entire form before submitting
    const validateInput = (username: string, email: string, password: string) => {
        const UserSchema = z.object({
            username: z
                .string()
                .min(3, userLengthErr)
                .max(20, userLengthErr)
                .refine((value) => !bannedUsernames.includes(value) && !detect(value), userNotAllowedErr)
                .refine((value) => !value.includes(' ') && !value.includes('*'), userCharsErr),
            email: z.string().email('Invalid email'),
            password: z
                .string()
                .min(6, passLengthErr)
                .max(16, passLengthErr)
                .refine((value) => !value.includes(' '), passCharsErr)
        });

        const result = UserSchema.safeParse({ username, email, password });
        if (!result.success) {
            const errors = result.error.errors;
            const newHelperTexts: HelperTexts = {
                username: undefined,
                email: undefined,
                password: undefined
            };
            errors.forEach((err) => {
                switch (err.path[0]) {
                    case 'username':
                        newHelperTexts.username = err.message;
                        break;
                    case 'email':
                        newHelperTexts.email = err.message;
                        break;
                    case 'password':
                        newHelperTexts.password = err.message;
                        break;
                }
            });
            setHelperTexts(newHelperTexts);
            return false;
        }
        return true;
    };

    // validate a single field on change
    const validateField = (name: 'username' | 'email' | 'password', value: string) => {
        let schema: z.ZodType;

        switch (name) {
            case 'username':
                schema = z
                    .string()
                    .min(3, userLengthErr)
                    .max(20, userLengthErr)
                    .refine((value) => !bannedUsernames.includes(value) && !detect(value), userNotAllowedErr)
                    .refine((value) => !value.includes(' ') && !value.includes('*'), userCharsErr);
                break;
            case 'email':
                schema = z.string().email('Invalid email');
                break;
            case 'password':
                schema = z
                    .string()
                    .min(6, passLengthErr)
                    .max(16, passLengthErr)
                    .refine((value) => !value.includes(' '), passCharsErr);
                break;
        }

        const result = schema.safeParse(value);

        if (!result.success) {
            const error = result.error.errors[0].message;
            setHelperTexts((prev) => ({ ...prev, [name]: error }));
        } else {
            setHelperTexts((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { username, email, password } = form;

        const success = validateInput(username, email, password);
        if (!success) return;

        try {
            const message = await register(username, email, password);
            const notification = {
                title: 'Registration completed.',
                content: message,
                severity: 'success'
            };
            dispatch(addNotification(notification));
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const notification = {
                    title: 'Unexpected error',
                    content: err.response ? err.response.data.message : 'An unknown error occurred.',
                    severity: 'error'
                };
                dispatch(addNotification(notification));
                throw err;
            } else if (typeof err === 'string') {
                const notification = {
                    title: 'Unexpected error',
                    content: err,
                    severity: 'error'
                };
                dispatch(addNotification(notification));
                throw new Error(err);
            } else {
                const notification = {
                    title: 'Unexpected error',
                    content: 'An unknown error occurred.',
                    severity: 'error'
                };
                dispatch(addNotification(notification));
                console.log(err);
            }
        }
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
                <div
                    id='presentation'
                    className={`w-96 h-[36rem] rounded-lg rounded-r-none -md:hidden select-none bg-gradient-to-bl from-blue-500 to-blue-700
                        flex flex-col justify-between
                        before:bg-white before:opacity-0 before:absolute before:w-96 before:h-full`}
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
                            className='text-center text-[2.7rem] font-bold text-white px-6 tracking-tight'
                        >
                            Get started.
                        </motion.h2>
                        <div
                            className='w-0 h-0 ml-auto'
                            style={{ borderTop: '30px solid transparent', borderBottom: '30px solid transparent', borderRight: '30px solid rgb(255 255 255)' }}
                        />
                    </div>
                    <div id='bottom' className='h-12 w-max px-4 py-2'>
                        <p className='text-sm text-white font-semibold'>{new Date().getFullYear()} LuxEdge Furnitures.</p>
                    </div>
                </div>
                <div id='form' className='w-96 h-[36rem] rounded-lg md:rounded-l-none bg-white flex flex-col items-center'>
                    <div id='top' className='py-12'>
                        <h2 className='font-extrabold text-center text-[2.7rem] tracking-tight select-none'>Register</h2>
                    </div>
                    <form autoComplete='off' spellCheck='false' onSubmit={handleRegister}>
                        <div id='center' className='h-max w-full flex flex-col gap-8 items-center mt-4'>
                            <Input
                                type='text'
                                helperText={helperTexts.username}
                                error={!!helperTexts.username}
                                placeholder='Username'
                                name='username'
                                value={form.username}
                                onChange={handleChange}
                                containerClassName='w-3/4'
                            />
                            <Input
                                type='email'
                                helperText={helperTexts.email}
                                error={!!helperTexts.email}
                                placeholder='Email'
                                name='email'
                                value={form.email}
                                onChange={handleChange}
                                containerClassName='w-3/4'
                            />
                            <Input
                                type='password'
                                helperText={helperTexts.password}
                                error={!!helperTexts.password}
                                placeholder='Password'
                                name='password'
                                value={form.password}
                                onChange={handleChange}
                                containerClassName='w-3/4'
                            />
                        </div>
                        <div id='bottom' className='w-full flex flex-col mt-16 items-center'>
                            <Button type='submit' className='w-3/4'>
                                Register
                            </Button>
                            <p className='mt-4 text-sm text-gray-500 font-semibold'>
                                Already have an account?{' '}
                                <a className='text-primary-base hover:text-primary-hover' href='/login'>
                                    Login
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

export default RegisterPage;
