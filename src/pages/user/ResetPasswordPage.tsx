import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LuxEdge from '@/components/LuxEdgeLogo';
import Input from '@/components/CustomElements/StyledInput';
import Button from '@/components/CustomElements/StyledButton';
import { z } from 'zod';
import { resetPassword } from '@/api/authApi';
import useAuth from '@/hooks/useAuth';
import NotificationsMenu from '@/components/NotificationsMenu';
import useErrHandler from '@/hooks/useErrHandler';

const ResetPasswordPage: React.FC = () => {
    const { userId, token } = useParams();
    const isAuth = useAuth();
    const handleErr = useErrHandler();

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
            setResult(handleErr(err, 'An error occurred while resetting your password.'));
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
            <main className='absolute left-1/2 top-1/2 flex h-fit w-fit -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-white p-8'>
                <LuxEdge className='text-5xl -md:text-4xl' />
                <h1 className='mb-4 mt-10 text-4xl font-bold tracking-tight -md:text-3xl'>Forgot Password</h1>
                <h2 className='mb-10 text-2xl font-semibold tracking-wide -md:text-xl'>Select your new password and press the button to confirm.</h2>
                <form autoComplete='off' autoCapitalize='off' spellCheck='false' className='flex w-full flex-col items-center gap-4' onSubmit={handleConfirm}>
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
                    <h6 className='mt-4 text-lg font-semibold text-gray-500'>{result}</h6>
                </form>
            </main>
            <NotificationsMenu />
        </div>
    );
};

export default ResetPasswordPage;
