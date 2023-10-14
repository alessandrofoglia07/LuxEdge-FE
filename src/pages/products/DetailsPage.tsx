import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Product } from '@/types';
import { toPlural, toSingular } from '@/utils/singularPlural';

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
                {product && !loading ? <></> : null}
            </main>
            <Footer />
        </div>
    );
};

export default DetailsPage;
