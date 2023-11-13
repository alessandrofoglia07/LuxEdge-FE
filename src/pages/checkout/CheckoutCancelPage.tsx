import React, { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import authAxios from '@/api/authAxios';

const CheckoutCancelPage: React.FC = () => {
    const [searchParams] = useSearchParams();

    const calcelPayment = async () => {
        const session_id = searchParams.get('session_id');
        if (!session_id) return;
        try {
            await authAxios.delete(`/payment/cancel?session_id=${session_id}`);
        } catch (err: unknown) {
            console.log(err);
        }
    };

    useEffect(() => {
        calcelPayment();
    }, [searchParams]);

    return <Navigate to='/cart' />;
};

export default CheckoutCancelPage;
