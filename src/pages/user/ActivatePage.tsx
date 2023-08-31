import React, { useEffect, useState } from 'react';
import { activateAccount } from '@/api/authApi';
import Button from '@/components/CustomElements/StyledButton';
import LuxEdge from '@/components/LuxEdgeLogo';
import Navbar from '@/components/Navbar';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';

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
            if (err instanceof AxiosError) {
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
            <main className='absolute top-1/2 left-1/2 w-max -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center gap-8'>
                <LuxEdge className='text-5xl -md:text-4xl' />
                <h2 className='text-4xl -md:text-3xl font-bold mb-8'>Activate your account.</h2>
                <Button disabled={loading || !!result} onClick={handleActivate} className={`w-64 h-16 text-xl ${(loading || !!result) && 'bg-primary-light hover:bg-primary-light'}`}>
                    Activate
                </Button>
                <h4 className='font-semibold text-2xl'>{result}</h4>
            </main>
        </div>
    );
};

export default ActivatePage;
