import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Product } from '@/types';
import Img from '@/components/CustomElements/CustomImg';
import toUrl from '@/utils/toUrl';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authAxios from '@/api/authAxios';
import Spinner from '@/components/Spinner';
import { CheckIcon, XMarkIcon, XCircleIcon } from '@heroicons/react/20/solid';
import toPrice from '@/utils/toPrice';
import { toPlural } from '@/utils/singularPlural';
import { motion } from 'framer-motion';
import NotificationsMenu from '@/components/NotificationsMenu';
import useErrHandler from '@/hooks/useErrHandler';

interface ProductCardProps {
    product: Product;
    handleRemove: (id: string) => void;
}

const ProductCardDesktop = ({ product, handleRemove }: ProductCardProps) => (
    <div className='flex items-center [&>*]:text-start [&>*]:font-semibold [&>*]:tracking-wide'>
        <div className='flex w-5/12 items-center'>
            <a className='w-1/3 rounded-lg' href={`/products/${toPlural(product.category)}/${product.name}`}>
                <Img src={toUrl(product.imagePath)} alt={product.name} className='aspect-square w-full rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl' />
            </a>
            <a href={`/products/${toPlural(product.category)}/${product.name}`} className='w-2/3 px-8 text-xl tracking-wide'>
                {product.name}
            </a>
        </div>
        <div className='flex w-5/12 items-center justify-evenly [&>*]:font-normal'>
            <h6 className='w-2/4 text-start capitalize'>{product.category}</h6>
            {product.available ? (
                <div className='flex w-1/6 items-center justify-center'>
                    <CheckIcon className='w-8' />
                </div>
            ) : (
                <div className='flex w-1/6 items-center justify-center'>
                    <XMarkIcon className='w-8' />
                </div>
            )}
            <h6 className='w-2/6 text-end'>{toPrice(product.price)}</h6>
        </div>
        <div className='flex w-2/12 items-center justify-center'>
            <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className='rounded-full' onClick={() => handleRemove(product._id)}>
                <XCircleIcon aria-label='Remove from favorites' className='w-8' />
            </motion.button>
        </div>
    </div>
);

const ProductCardMobile = ({ product, handleRemove }: ProductCardProps) => (
    <div className='flex items-center [&>*]:text-start [&>*]:font-semibold [&>*]:tracking-wide'>
        <a className='w-4/12 rounded-lg' href={`/products/${toPlural(product.category)}/${product.name}`}>
            <Img src={toUrl(product.imagePath)} alt={product.name} className='aspect-square w-full rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl' />
        </a>
        <div className='flex w-6/12 flex-col pl-8'>
            <a href={`/products/${toPlural(product.category)}/${product.name}`} className='text-lg tracking-tight'>
                {product.name}
            </a>
            <h6 className='text-start capitalize opacity-70'>{product.category}</h6>
            <h6 className='text-end'>{toPrice(product.price)}</h6>
        </div>
        <div className='flex w-2/12 items-center justify-center'>
            <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className='rounded-full' onClick={() => handleRemove(product._id)}>
                <XCircleIcon aria-label='Remove from favorites' className='w-8' />
            </motion.button>
        </div>
    </div>
);

const FavoritesPage: React.FC = () => {
    const isAuth = useAuth();
    const navigate = useNavigate();
    const handleErr = useErrHandler();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
        }

        (async () => {
            setLoading(true);
            try {
                const favsList = await authAxios.get('/lists/favorites/products');

                setProducts(favsList.data);
            } catch (err: unknown) {
                handleErr(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [isAuth]);

    const handleRemoveProduct = async (id: string) => {
        try {
            await authAxios.patch(`/lists/favorites/remove/${id}`);

            setProducts((prev) => prev.filter((product) => product._id !== id));
        } catch (err: unknown) {
            handleErr(err);
        }
    };

    return (
        <div id='FavoritesPage'>
            <Navbar />
            <main className='min-h-page py-16'>
                {loading ? (
                    <div className='absolute left-1/2 -translate-x-1/2'>
                        <Spinner className='mt-[20vh]' />
                    </div>
                ) : (
                    <>
                        <h2 className='ml-10 mt-6 text-5xl font-extrabold tracking-tight -md:text-3xl'>Favorites</h2>
                        <div className='mt-8 w-full max-w-7xl px-10 -md:hidden'>
                            <div id='table-header' className='border-b-2 pb-3'>
                                <div className='flex items-center [&>*]:text-start [&>*]:font-semibold [&>*]:tracking-wide'>
                                    <h6 className='w-5/12'>Added Items</h6>
                                    <div className='flex w-5/12 items-center justify-evenly'>
                                        <h6 className='w-2/4 text-start'>Category</h6>
                                        <h6 className='w-1/6 text-center'>Available</h6>
                                        <h6 className='w-2/6 text-end'>Price</h6>
                                    </div>
                                    <div className='w-2/12' />
                                </div>
                            </div>
                            <div id='table-body' className='flex flex-col gap-8'>
                                {products.length === 0 ? (
                                    <h3 className='absolute left-1/2 -translate-x-1/2 pt-[20vh] text-center text-2xl font-bold'>No products found</h3>
                                ) : (
                                    products.map((products) => <ProductCardDesktop handleRemove={handleRemoveProduct} product={products} key={products._id} />)
                                )}
                            </div>
                        </div>
                        <div className='mt-4 w-full border-t-2 px-2 pt-4 md:hidden'>
                            {products.length === 0 ? (
                                <h3 className='text-center text-2xl font-bold -md:text-xl'>No products found</h3>
                            ) : (
                                <div className='flex flex-col items-center gap-6'>
                                    {products.map((products) => (
                                        <ProductCardMobile handleRemove={handleRemoveProduct} product={products} key={products._id} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
            <Footer />
            <NotificationsMenu />
        </div>
    );
};

export default FavoritesPage;
