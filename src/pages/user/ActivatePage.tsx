import React, { useEffect, useState } from 'react';
import { activateAccount } from '@/api/authApi';
import Button from '@/components/CustomElements/StyledButton';
import LuxEdge from '@/components/LuxEdgeLogo';
import Navbar from '@/components/Navbar';
import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import NotificationsMenu from '@/components/NotificationsMenu';

const ActivatePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleActivate = async () => {
        setLoading(true);

        if (!userId) {
            setResult('Invalid user ID.');
            setLoading(false);
            return;
        }

        const defaultErr = 'An error occurred while activating your account.';

        try {
            const message = await activateAccount(userId);
            setResult(message);
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                setResult(err.response?.data.message || defaultErr);
                throw err;
            } else if (typeof err === 'string') {
                setResult(err);
                throw new Error(err);
            } else {
                setResult(defaultErr);
                console.log(err);
            }
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div id='ActivatePage'>
            <Navbar />
            <main className='absolute left-1/2 top-1/2 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8 text-center'>
                <LuxEdge className='text-5xl -md:text-4xl' />
                <h2 className='mb-8 text-4xl font-bold -md:text-3xl'>Activate your account.</h2>
                <Button disabled={loading || !!result} onClick={handleActivate} className={`h-16 w-64 text-xl ${(loading || !!result) && 'bg-primary-light hover:bg-primary-light'}`}>
                    Activate
                </Button>
                <h4 className='text-2xl font-semibold'>{result}</h4>
            </main>
            <NotificationsMenu />
        </div>
    );
};

export default ActivatePage;
