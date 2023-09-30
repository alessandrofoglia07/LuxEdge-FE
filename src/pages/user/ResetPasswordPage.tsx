import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LuxEdge from '@/components/LuxEdgeLogo';
import Input from '@/components/CustomElements/StyledInput';
import Button from '@/components/CustomElements/StyledButton';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { resetPassword } from '@/api/authApi';
import useAuth from '@/hooks/useAuth';

const ResetPasswordPage: React.FC = () => {
    const { userId, token } = useParams();
    const isAuth = useAuth();

    const [input, setInput] = useState({
        newPassword: '',
        confirmNewPassword: ''
    });
    const [result, setResult] = useState('');

    useEffect(() => {
        const letterRegex = /[a-zA-Z]/;

        if (letterRegex.test(result.slice(-1))) {
            setResult((prev) => prev + '.');
        }
    }, [result]);

    useEffect(() => {
        const body = document.querySelector('body');
        body?.classList.add('bg-slate-200');
        return () => body?.classList.remove('bg-slate-200');
    }, []);

    const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (input.newPassword !== input.confirmNewPassword) {
            setResult('Passwords do not match.');
            return;
        }

        const passLengthErr = 'Password must be 6-16 characters long';
        const passCharsErr = 'Password cannot contain spaces';

        const passSchema = z
            .string()
            .min(6, passLengthErr)
            .max(16, passLengthErr)
            .refine((value) => !value.includes(' '), passCharsErr);

        const val = passSchema.safeParse(input.newPassword);

        if (!val.success) {
            setResult(val.error.errors.map((err) => err.message).join('\n') || 'An error occurred while resetting your password.');
            return;
        }

        if (!userId || !token) {
            setResult('An error occurred while resetting your password.');
            return;
        }

        try {
            const message = await resetPassword(userId, token, input.newPassword);
            if (message) {
                setResult('Password reset successfully. You can now log in with your new password.');
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setResult(err.response?.data.message || 'An error occurred while resetting your password.');
                throw err;
            } else if (typeof err === 'string') {
                setResult(err);
                throw new Error(err);
            } else {
                setResult('An error occurred while resetting your password.');
                console.log(err);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    return isAuth ? (
        <Navigate to='/' />
    ) : (
        <div id='ResetPasswordPage'>
            <Navbar />
            <main className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-fit h-fit rounded-lg bg-white p-8'>
                <LuxEdge className='text-5xl -md:text-4xl' />
                <h1 className='text-4xl -md:text-3xl font-bold mt-10 mb-4 tracking-tight'>Forgot Password</h1>
                <h2 className='text-2xl -md:text-xl font-semibold mb-10 tracking-wide'>Select your new password and press the button to confirm.</h2>
                <form autoComplete='off' autoCapitalize='off' spellCheck='false' className='w-full flex flex-col items-center gap-4' onSubmit={handleConfirm}>
                    <Input type='password' value={input.newPassword} onChange={handleChange} name='newPassword' placeholder='New password' containerClassName='w-1/2' />
                    <Input
                        type='password'
                        value={input.confirmNewPassword}
                        onChange={handleChange}
                        name='confirmNewPassword'
                        placeholder='Confirm new password'
                        containerClassName='w-1/2'
                    />
                    <Button type='submit' className='w-1/2'>
                        Confirm
                    </Button>
                    <h6 className='font-semibold text-lg mt-4 text-gray-500'>{result}</h6>
                </form>
            </main>
        </div>
    );
};

export default ResetPasswordPage;
