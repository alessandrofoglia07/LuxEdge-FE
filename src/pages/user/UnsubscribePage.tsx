import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Spinner from '@/components/Spinner';
import NotificationsMenu from '@/components/NotificationsMenu';

type State = 'subscribed' | 'unsubscribed' | 'resubscribed' | 'loading';

const UnsubscribePage: React.FC = () => {
    const { userId } = useParams();
    const [state, setState] = useState<State>('subscribed');

    const handleUnsubscribe = async () => {
        try {
            setState('loading');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter/unsubscribe/${userId}`);
            setState('unsubscribed');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                throw err.response?.data;
            } else {
                console.log(err);
            }
        }
    };

    const handleSubscribeBack = async () => {
        try {
            setState('loading');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter/resubscribe/${userId}`);
            setState('resubscribed');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                throw err.response?.data;
            } else {
                console.log(err);
            }
        }
    };

    const render = () => {
        switch (state) {
            case 'subscribed':
                return (
                    <>
                        <h1 className='font-extrabold text-4xl tracking-tight mb-16'>Unsubscribe from LuxEdge's Newsletter</h1>
                        <p className='font-semibold text-2xl'>Are you sure you want to unsubscribe?</p>
                        <button
                            className='mb-24 mt-8 bg-primary-base hover:bg-primary-hover w-1/2 md:w-auto md:px-8 py-3 text-white rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out font-semibold'
                            onClick={handleUnsubscribe}
                        >
                            Unsubscribe
                        </button>
                    </>
                );
            case 'unsubscribed':
                return (
                    <>
                        <h1 className='font-extrabold text-4xl tracking-tight mb-16'>You have been successfully unsubscribed</h1>
                        <p className='font-semibold text-2xl'>We're sorry to see you go. If you change your mind, you can always resubscribe in the future.</p>
                        <button
                            className='mb-24 mt-8 bg-primary-base hover:bg-primary-hover w-1/2 md:w-auto md:px-8 py-3 text-white rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out font-semibold'
                            onClick={handleSubscribeBack}
                        >
                            Resubscribe
                        </button>
                    </>
                );
            case 'resubscribed':
                return (
                    <>
                        <h1 className='font-extrabold text-4xl tracking-tight mb-16'>You have been successfully resubscribed</h1>
                        <p className='font-semibold text-2xl mb-8'>Thank you for resubscribing to our newsletter.</p>
                        <a
                            className='mb-24 bg-primary-base hover:bg-primary-hover w-1/2 md:w-auto md:px-8 py-3 text-white rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out font-semibold'
                            href='/'
                        >
                            Continue to LuxEdge
                        </a>
                    </>
                );
            case 'loading':
                return (
                    <>
                        <Spinner />
                    </>
                );
        }
    };

    useEffect(() => {
        document.body.classList.add('bg-gray-200');
    }, []);

    return (
        <div id='UnsubscribePage'>
            <Navbar />
            <main className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center md:w-1/2 w-full'>{render()}</main>
            <NotificationsMenu />
        </div>
    );
};

export default UnsubscribePage;
