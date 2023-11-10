import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import authAxios from '@/api/authAxios';
import Navbar from '@/components/Navbar';
import Spinner from '@/components/Spinner';
import lottie from 'lottie-web';
import successAnimation from '@/static/success.json';
import errorAnimation from '@/static/error.json';

type StateT = 'loading' | 'error' | 'success';

const CheckoutSuccessPage: React.FC = () => {
    const [state, setState] = useState<StateT>('loading');
    const [animationOpen, setAnimationOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const confirmPayment = async (session_id: string) => {
        try {
            const { data } = await authAxios.post(`/payment/confirm?session_id=${session_id}`);
            if (data) {
                setState('success');
            } else {
                setState('error');
            }
        } catch (err: unknown) {
            setState('error');
        }
    };

    useEffect(() => {
        const session_id = searchParams.get('session_id');
        if (!session_id) {
            setState('error');
            return;
        }
        confirmPayment(session_id);
    }, [searchParams]);

    useEffect(() => {
        if (animationOpen) return;
        if (state === 'success') {
            lottie.loadAnimation({
                container: document.getElementById('animation') as Element,
                animationData: successAnimation,
                renderer: 'svg',
                loop: false,
                autoplay: true
            });
            setAnimationOpen(true);
        } else if (state === 'error') {
            lottie.loadAnimation({
                container: document.getElementById('animation') as Element,
                animationData: errorAnimation,
                renderer: 'svg',
                loop: false,
                autoplay: true
            });
        }
    }, [state]);

    const render = () => {
        switch (state) {
            case 'loading':
                return (
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <Spinner className='h-16 w-16' />
                    </div>
                );
            case 'error':
                return (
                    <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center'>
                        <div id='animation' className='-mt-20 h-44 w-44 select-none' />
                        <h2 className='pt-4 text-4xl font-extrabold tracking-tight'>Payment failed!</h2>
                        <h4 className='pt-2 font-normal text-gray-700'>Please try again later.</h4>
                        <a href='/' className='pt-4 font-normal underline underline-offset-2'>
                            Go back to LuxEdge
                        </a>
                    </div>
                );
            case 'success':
                return (
                    <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center'>
                        <div id='animation' className='-mt-20 h-44 w-44 select-none' />
                        <h2 className='pt-4 text-4xl font-extrabold tracking-tight'>Payment completed!</h2>
                        <h4 className='pt-2 font-normal text-gray-700'>Thanks for choosing LuxEdge. We hope to see you again soon!</h4>
                        <a href='/' className='pt-4 font-normal underline underline-offset-2'>
                            Go back to LuxEdge
                        </a>
                    </div>
                );
        }
    };

    return (
        <div id='CheckoutSuccessPage'>
            <Navbar />
            <main className='w-[calc(100vw - 9px)] mx-auto pt-16'>{render()}</main>
        </div>
    );
};

export default CheckoutSuccessPage;
