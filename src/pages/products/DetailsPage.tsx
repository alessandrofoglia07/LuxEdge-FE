import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Product } from '@/types';
import { toPlural, toSingular } from '@/utils/singularPlural';
import toUrl from '@/utils/toUrl';
import Img from '@/components/CustomElements/CustomImg';
import toPrice from '@/utils/toPrice';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/solid';
import Rating from '@/components/Rating';

const DetailsPage: React.FC = () => {
    const productName = useParams<{ productName: string }>().productName;
    const productCategory = toSingular(useParams<{ productCategory: string }>().productCategory || '');

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            setLoading(true);

            (async () => {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/details/name/${productName}`);
                if (data.category !== productCategory) throw new Error('Product not found');
                setProduct(data);
            })();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data);
            }
        } finally {
            setLoading(false);
        }
    }, [productName]);

    return (
        <div id='DetailsPage'>
            <Navbar />
            <main className='pt-16 mx-auto w-[calc(100vw - 9px)] flex flex-col min-h-page'>
                <h4 className='py-8 md:px-12 px-4 md:text-lg text-md font-semibold [&>a]:text-gray-700 [&>span]:text-gray-400 [&>span]:select-none'>
                    <a href='/products'>Products</a> <span className='px-2'>/</span>{' '}
                    <a href={`/products?tags=${toPlural(productCategory) === 'Living rooms' ? 'livingrooms' : toPlural(productCategory).toLowerCase()}`} className='capitalize'>
                        {toPlural(productCategory!)}
                    </a>{' '}
                    <span className='px-2'>/</span>
                    <a className='capitalize' href={`/products/${toPlural(productCategory)}/${productName}`}>
                        {productName}
                    </a>
                </h4>
                {/* TODO: add reviews */}
                {product && !loading ? (
                    <div className='lg:w-fit w-full relative left-1/2 -translate-x-1/2 flex -md:flex-col lg:gap-16 gap-8 justify-center lg:px-8 px-4 mt-8 h-max'>
                        <Img
                            src={toUrl(product.imagePath)}
                            alt={product.name}
                            className='max-w-xl md:w-1/3 md:h-1/3 sm:w-1/2 sm:h-1/2 w-full h-full self-center aspect-square rounded-md'
                        />
                        <div className='md:w-1/2 w-full -md:px-8 h-full md:py-16 pb-32 -md:flex -md:flex-col items-center'>
                            <h1 className='font-extrabold text-5xl mb-8 h-fit -md:text-center'>{product.name}</h1>
                            <h4 className='text-xl h-fit -md:text-center'>{product.description}</h4>
                            {product.rating > 0 && <Rating rating={product.rating} />}
                            <div className='flex items-center -md:flex-col justify-between mt-16'>
                                <div className='flex items-center'>
                                    <button className='text-xl flex items-center gap-4 text-white bg-primary-base hover:bg-primary-hover transition-colors py-4 px-6 rounded-md mr-2 whitespace-nowrap'>
                                        <ShoppingCartIcon className='w-8 h-8' />
                                        Add to Cart
                                    </button>
                                    <button className='bg-white text-primary-base hover:text-primary-hover border-2 border-primary-base hover:border-primary-hover hover:bg-slate-200 transition-colors p-3 rounded-md mr-2'>
                                        <HeartIcon className='w-8 h-8' />
                                    </button>
                                </div>
                                <h3 className='text-3xl font-extrabold text-primary-base whitespace-nowrap -md:mt-8'>{toPrice(product.price)}</h3>
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>
            <Footer />
        </div>
    );
};

export default DetailsPage;
