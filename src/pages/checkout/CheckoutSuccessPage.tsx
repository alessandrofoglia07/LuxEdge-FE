import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import authAxios from '@/api/authAxios';
import Navbar from '@/components/Navbar';
import Spinner from '@/components/Spinner';

type StateT = 'loading' | 'error' | 'success';

const CheckoutSuccessPage: React.FC = () => {
    const [state, setState] = useState<StateT>('loading');
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

    const render = () => {
        switch (state) {
            case 'loading':
                return (
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <Spinner className='w-16 h-16' />
                    </div>
                );
            case 'error':
                return <div>Error TODO</div>;
            case 'success':
                return <div>Success TODO</div>;
        }
    };

    return (
        <div id='CheckoutSuccessPage'>
            <Navbar />
            <main className='pt-16 mx-auto w-[calc(100vw - 9px)]'>{render()}</main>
        </div>
    );
};

export default CheckoutSuccessPage;
