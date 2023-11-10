import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Navigate } from 'react-router-dom';
import Input from '@/components/CustomElements/StyledInput';
import LuxEdge from '@/components/LuxEdgeLogo';
import Button from '@/components/CustomElements/StyledButton';
import { forgotPassword } from '@/api/authApi';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import useAuth from '@/hooks/useAuth';
import NotificationsMenu from '@/components/NotificationsMenu';

const ForgotPasswordPage: React.FC = () => {
    const isAuth = useAuth();

    const [email, setEmail] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        const letterRegex = /[a-zA-Z]/;

        if (letterRegex.test(result.slice(-1))) {
            setResult((prev) => prev + '.');
        }
    }, [result]);

    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!z.string().email().safeParse(email).success) {
            setResult('Please enter a valid email address.');
            return;
        }

        try {
            const message = await forgotPassword(email);
            if (message) {
                setResult('Email sent successfully. Check your email inbox.');
                return;
            }
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setResult(err.response?.data.message || 'An error occurred while sending the email.');
                throw err;
            } else if (typeof err === 'string') {
                setResult(err);
                throw new Error(err);
            } else {
                setResult('An error occurred while sending the email.');
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
        <div id='ForgotPasswordPage'>
            <Navbar />
            <main className='absolute left-1/2 top-1/2 flex h-fit w-fit -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-white p-8'>
                <LuxEdge className='text-5xl -md:text-4xl' />
                <h1 className='mb-4 mt-10 text-4xl font-bold tracking-tight -md:text-3xl'>Forgot Password</h1>
                <h2 className='mb-10 text-2xl font-semibold tracking-wide -md:text-xl'>You will be sent an email with a link to reset your password.</h2>
                <form autoComplete='off' autoCapitalize='off' spellCheck='false' className='flex w-full flex-col items-center' onSubmit={handleSend}>
                    <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} name='email' placeholder='Email' containerClassName='w-1/2' />
                    <Button type='submit' className='mt-4 w-1/2'>
                        Send
                    </Button>
                    <h6 className='mt-4 text-lg font-semibold text-gray-500'>{result}</h6>
                </form>
            </main>
            <NotificationsMenu />
        </div>
    );
};

export default ForgotPasswordPage;
