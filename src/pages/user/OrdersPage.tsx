import React, { useState, useEffect } from 'react';
import authAxios from '@/api/authAxios';
import { Order } from '@/types';
import Spinner from '@/components/Spinner';
import Navbar from '@/components/Navbar';
import NotificationsMenu from '@/components/NotificationsMenu';
import toPrice from '@/utils/toPrice';
import Pagination from '@/components/Pagination';
import useErrHandler from '@/hooks/useErrHandler';

interface OrderProps {
    order: Order;
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {
    return (
        <div id='order-card' className='elevate my-4 h-max w-3/5 rounded-lg  px-6 py-6 -lg:w-full'>
            <div className='flex h-max w-full justify-between gap-4 -md:flex-col'>
                <h1 className='break-words text-xl font-bold'>Order ID: {order._id}</h1>
                <h2 className='text-lg font-normal'>{new Date(order.createdAt).toUTCString().slice(0, -13)}</h2>
            </div>
            <div className='mb-6 flex h-max w-full justify-between gap-4 -md:flex-col'>
                <h1 className='text-xl font-bold'>{toPrice(order.totalPrice)}</h1>
                <h2 className='text-lg font-normal'>
                    Status:{' '}
                    <span
                        className={
                            (order.paymentStatus === 'pending'
                                ? 'text-yellow-500'
                                : order.paymentStatus === 'completed'
                                ? 'text-green-700'
                                : order.paymentStatus === 'failed'
                                ? 'text-red-700'
                                : 'text-black') + ' font-semibold'
                        }>
                        {order.paymentStatus}
                    </span>
                </h2>
            </div>
            <a
                href={`/user/orders/${order._id}`}
                className='whitespace-nowrap rounded-lg bg-primary-base px-6 py-4 font-semibold text-white transition-all hover:rounded-md hover:bg-primary-hover'>
                View Details
            </a>
        </div>
    );
};

const ORDERS_PER_PAGE = 10;

const OrdersPage: React.FC = () => {
    const handleErr = useErrHandler();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await authAxios.get('/payment/orders');
            setOrders(data);
        } catch (err: unknown) {
            handleErr(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div id='OrdersPage'>
            <Navbar />
            <main className='w-[calc(100vw - 9px)] mx-auto py-16'>
                <h1 className='ml-10 mt-6 text-5xl font-extrabold tracking-tight -md:text-3xl'>Orders</h1>
                {loading ? (
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <Spinner className='h-16 w-16' />
                    </div>
                ) : (
                    <div className='mt-8 flex flex-col items-center px-10'>
                        {orders.slice((currentPage - 1) * ORDERS_PER_PAGE, (currentPage - 1) * ORDERS_PER_PAGE + ORDERS_PER_PAGE).map((order) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                        <Pagination pageSize={ORDERS_PER_PAGE} currentPage={currentPage} totalCount={orders.length} onPageChange={handlePageChange} />
                    </div>
                )}
            </main>
            <NotificationsMenu />
        </div>
    );
};

export default OrdersPage;
