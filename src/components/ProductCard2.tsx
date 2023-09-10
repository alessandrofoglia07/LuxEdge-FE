/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import useSelector from '@/hooks/useSelector';
import { Product } from '@/types';
import { StarIcon } from '@heroicons/react/20/solid';
import authAxios from '@/api/authAxios';
import Img from './CustomElements/CustomImg';

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = (_: Props) => {
    const { accessToken } = useSelector((state) => state.auth);

    const [product, setProduct] = useState<Product | null>(null);
    const [favsList, setFavsList] = useState<Product[] | null>(null);

    const toUrl = (path: string) => {
        return `${import.meta.env.VITE_API_URL}/products/${path}`;
    };

    const getFavsList = async () => {
        try {
            const res = await authAxios.get('/lists/favs');
            setFavsList(res.data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            } else if (typeof err === 'string') {
                throw new Error(err);
            } else {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        if (accessToken) {
            getFavsList();
        }
    }, [accessToken]);

    useEffect(() => {
        setProduct(_.product);
    }, [_]);

    return (
        <div id='ProductCard' className='w-96 aspect-square group'>
            {product ? (
                <>
                    <Img src={toUrl(product.imagePath)} alt={product.name} className='w-full aspect-square rounded-lg shadow-md' />
                    <div className='flex group-hover:opacity-100 transition-opacity duration-300 opacity-0 p-2 flex-col -translate-y-full text-end items-end w-[21.9rem] rounded-b-lg bg-black bg-opacity-25 absolute'>
                        <a href={`/products/details/${product._id}`} className='text-2xl font-bold text-white mb-2'>
                            {product.name}
                        </a>
                        {favsList ? (
                            <button
                                id='favs'
                                className={`w-10 aspect-square grid place-items-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all rounded-lg ${
                                    favsList?.some((p) => p._id === product._id) ? 'text-yellow-400' : 'text-white'
                                }`}>
                                <StarIcon className='w-6 h-6' />
                            </button>
                        ) : null}
                    </div>
                </>
            ) : (
                <>
                    <Img src='/productPlaceholder.jpg' alt='placeholder' className='w-full aspect-square rounded-lg shadow-md' />
                </>
            )}
        </div>
    );
};

export default ProductCard;
