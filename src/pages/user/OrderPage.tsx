import React, { useState, useEffect } from 'react';
import authAxios from '@/api/authAxios';
import { Order, Item } from '@/types';
import { useParams } from 'react-router-dom';
import useErrHandler from '@/hooks/useErrHandler';
import Navbar from '@/components/Navbar';
import Spinner from '@/components/Spinner';
import NotificationsMenu from '@/components/NotificationsMenu';
import Img from '@/components/CustomElements/CustomImg';
import toUrl from '@/utils/toUrl';
import { toPlural } from '@/utils/singularPlural';
import toPrice from '@/utils/toPrice';

interface ProductCardProps {
    product: Item;
}

const ProductCard = ({ product }: ProductCardProps) => (
    <div className='flex items-center gap-16 -md:mb-12 [&>*]:text-start [&>*]:font-semibold [&>*]:tracking-wide'>
        <div className='flex items-center -md:hidden'>
            <div className='flex w-1/3 items-center'>
                <a className='w-1/3 rounded-lg' href={`/products/${toPlural(product.category)}/${product.name}`}>
                    <Img src={toUrl(product.imagePath)} alt={product.name} className='aspect-square w-full rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl' />
                </a>
                <a href={`/products/${toPlural(product.category)}/${product.name}`} className='w-2/3 px-4 text-xl font-bold'>
                    {product.name}
                </a>
            </div>
            <div className='flex w-1/3 items-center justify-evenly [&>*]:font-normal'>
                <h6 className='w-2/4 text-start capitalize'>{product.category}</h6>
                <h6 className='w-2/6 whitespace-nowrap text-end'>{toPrice(product.price)}</h6>
            </div>
            <div className='flex w-1/3 justify-evenly text-center'>
                <h6 className='whitespace-nowrap'>×{product.quantity}</h6>
                <h6>({toPrice(product.price * product.quantity)})</h6>
            </div>
        </div>
        <div className='flex w-full flex-col gap-4 md:hidden'>
            <div className='flex w-full items-center'>
                <a className='w-1/3 rounded-lg' href={`/products/${toPlural(product.category)}/${product.name}`}>
                    <Img src={toUrl(product.imagePath)} alt={product.name} className='aspect-square w-full rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl' />
                </a>
                <a href={`/products/${toPlural(product.category)}/${product.name}`} className='w-2/3 px-4 text-xl font-bold'>
                    {product.name}
                </a>
                <h6 className='w-2/4 text-start capitalize'>{product.category}</h6>
            </div>
            <div className='flex w-full items-center justify-end gap-8'>
                <h6 className='w-2/6 whitespace-nowrap text-end'>{toPrice(product.price)}</h6>
                <div className='flex items-center'>
                    <h6 className='whitespace-nowrap'>×{product.quantity}</h6>
                    <h6>({toPrice(product.price * product.quantity)})</h6>
                </div>
            </div>
        </div>
    </div>
);

const OrderPage: React.FC = () => {
    const handleErr = useErrHandler();
    const { orderId } = useParams();

    const [order, setOrder] = useState<Order | null>();
    const [loading, setLoading] = useState(false);
    const [showSessionId, setShowSessionId] = useState(false);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const { data } = await authAxios.get<Order>(`/payment/orders/${orderId}`);
            const items: Item[] = [];

            for (const product of data.products) {
                if (typeof product === 'string') continue;
                const item = items.find((item) => item._id === product._id);
                if (item) item.quantity++;
                else items.push({ ...product, quantity: 1 });
            }

            setOrder({ ...data, products: items });
        } catch (err: unknown) {
            handleErr(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    return (
        <div id='OrderPage'>
            <Navbar />
            <main className='w-[calc(100vw - 9px)] mx-auto py-16'>
                <h1 className='ml-10 mt-6 text-5xl font-extrabold tracking-tight -md:text-3xl'>Orders</h1>
                {loading ? (
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <Spinner className='h-16 w-16' />
                    </div>
                ) : (
                    <div className='mt-12 flex flex-col items-center px-10'>
                        {order && (
                            <div className='flex w-full flex-col'>
                                <h1 className='mb-6 text-3xl font-bold tracking-tight'>Order ID: {order._id}</h1>
                                <h3 className='mb-2 text-2xl font-bold'>
                                    Payment Status:{' '}
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
                                </h3>
                                <h3 className='mb-2 text-2xl font-bold'>
                                    Payment Method: <span className='font-extrabold capitalize'>{order.paymentType}</span>
                                </h3>
                                <h3 className='mb-2 break-words text-2xl font-bold'>
                                    Payment Session ID:{' '}
                                    {showSessionId ? (
                                        <span className='font-extrabold'>
                                            ${order.sessionId}{' '}
                                            <button
                                                onClick={() => setShowSessionId(false)}
                                                className='font-semibold text-gray-400 transition-colors hover:text-gray-500 hover:underline md:ml-2'>
                                                Hide
                                            </button>
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => setShowSessionId(true)}
                                            className='font-semibold text-gray-400 transition-colors hover:text-gray-500 hover:underline md:ml-2'>
                                            Show
                                        </button>
                                    )}
                                </h3>
                                <h3 className='mb-2 text-2xl font-bold'>
                                    Overall cost: <span className='font-extrabold'>${order.totalPrice}</span>
                                </h3>
                                <h3 className='mb-6 text-2xl font-bold'>
                                    Order made on: <span className='font-extrabold'>{new Date(order.createdAt).toUTCString().slice(0, -13)}</span>
                                </h3>
                                {!order.products.some((item) => typeof item === 'string') && (
                                    <>
                                        <h3 className='mb-4 text-3xl font-bold'>Items:</h3>
                                        <ul className='flex flex-col gap-2'>
                                            {order.products.map((item) => (
                                                <ProductCard key={(item as Item)._id} product={item as Item} />
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
            <NotificationsMenu />
        </div>
    );
};

export default OrderPage;
