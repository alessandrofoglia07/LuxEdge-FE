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
            <main className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-fit h-fit rounded-lg bg-white p-8'>
                <LuxEdge className='text-5xl -md:text-4xl' />
                <h1 className='text-4xl -md:text-3xl font-bold mt-10 mb-4 tracking-tight'>Forgot Password</h1>
                <h2 className='text-2xl -md:text-xl font-semibold mb-10 tracking-wide'>You will be sent an email with a link to reset your password.</h2>
                <form autoComplete='off' autoCapitalize='off' spellCheck='false' className='w-full flex flex-col items-center' onSubmit={handleSend}>
                    <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} name='email' placeholder='Email' containerClassName='w-1/2' />
                    <Button type='submit' className='mt-4 w-1/2'>
                        Send
                    </Button>
                    <h6 className='font-semibold text-lg mt-4 text-gray-500'>{result}</h6>
                </form>
            </main>
        </div>
    );
};

export default ForgotPasswordPage;
