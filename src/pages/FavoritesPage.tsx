import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Product } from '@/types';
import Img from '@/components/CustomElements/CustomImg';
import toUrl from '@/utils/toUrl';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authAxios from '@/api/authAxios';
import { AxiosError } from 'axios';
import Spinner from '@/components/Spinner';
import { CheckIcon, XMarkIcon, XCircleIcon } from '@heroicons/react/20/solid';
import toPrice from '@/utils/toPrice';

const ProductCard = ({ product, handleRemove }: { product: Product; handleRemove: (id: string) => void }) => {
    return (
        <div className='[&>*]:font-semibold [&>*]:tracking-wide [&>*]:text-start flex items-center'>
            <div className='w-5/12 flex items-center'>
                <a className='rounded-lg' href={`/procuts/details/${product.name}`}>
                    <Img src={toUrl(product.imagePath)} alt={product.name} className='w-48 aspect-square rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300' />
                </a>
                <a href={`/procuts/details/${product.name}`} className='pl-8 text-xl tracking-wide'>
                    {product.name}
                </a>
            </div>
            <div className='flex items-center justify-evenly w-5/12 [&>*]:font-normal'>
                <h6 className='capitalize text-start w-2/4'>{product.category}</h6>
                {product.available ? (
                    <div className='flex items-center justify-center w-1/6'>
                        <CheckIcon className='w-8' />
                    </div>
                ) : (
                    <div className='flex items-center justify-center w-1/6'>
                        <XMarkIcon className='w-8' />
                    </div>
                )}
                <h6 className='text-end w-2/6'>{toPrice(product.price)}</h6>
            </div>
            <div className='w-2/12 flex items-center justify-center'>
                <button className='rounded-full' onClick={() => handleRemove(product._id)}>
                    <XCircleIcon aria-label='Remove from favorites' className='w-8' />
                </button>
            </div>
        </div>
    );
};

const FavoritesPage: React.FC = () => {
    const isAuth = useAuth();
    const navigate = useNavigate();

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
                if (err instanceof AxiosError) {
                    throw err.response?.data;
                } else if (err instanceof Error) {
                    throw err;
                } else if (typeof err === 'string') {
                    throw new Error(err);
                } else {
                    console.log(err);
                }
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
            if (err instanceof AxiosError) {
                throw err.response?.data;
            } else if (err instanceof Error) {
                throw err;
            } else if (typeof err === 'string') {
                throw new Error(err);
            } else {
                console.log(err);
            }
        }
    };

    return (
        <div id='FavoritesPage'>
            <Navbar />
            <main className='pt-16 min-h-screen'>
                {loading ? (
                    <div className='absolute right-1/2 -translate-x-1/2'>
                        <Spinner className='mt-[20vh]' />
                    </div>
                ) : (
                    <>
                        {/* TODO: make this responsive */}
                        <h2 className='font-extrabold text-5xl tracking-tight mt-6 ml-10'>Favorites</h2>
                        <div className='w-full px-10 mt-8'>
                            <div id='table-header' className='border-b-2 pb-3'>
                                <div className='[&>*]:font-semibold [&>*]:tracking-wide [&>*]:text-start flex items-center'>
                                    <h6 className='w-5/12'>Added Items</h6>
                                    <div className='flex items-center justify-evenly w-5/12'>
                                        <h6 className='text-start w-2/4'>Category</h6>
                                        <h6 className='text-center w-1/6'>Available</h6>
                                        <h6 className='text-end w-2/6'>Price</h6>
                                    </div>
                                    <div className='w-2/12' />
                                </div>
                            </div>
                            <div id='table-body' className='flex flex-col gap-8'>
                                {products.length === 0 ? (
                                    <h3 className='absolute left-1/2 -translate-x-1/2 pt-[20vh] text-center font-bold text-2xl'>No products found</h3>
                                ) : (
                                    products.map((products) => <ProductCard handleRemove={handleRemoveProduct} product={products} key={products._id} />)
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default FavoritesPage;
