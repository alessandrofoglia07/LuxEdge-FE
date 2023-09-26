/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import useSelector from '@/hooks/useSelector';
import { Product } from '@/types';
import { HeartIcon } from '@heroicons/react/20/solid';
import authAxios from '@/api/authAxios';
import Img from './CustomElements/CustomImg';
import { useNavigate } from 'react-router-dom';

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = (_: Props) => {
    const { accessToken } = useSelector((state) => state.auth);
    const navigate = useNavigate();

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

    const handleFavorite = async () => {
        if (!accessToken) {
            navigate('/login');
        } else {
            // TODO: add
            console.log(product, 'Product fav clicked');
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
        <div id='ProductCard' className='md:w-96 md:h-96 w-64 h-64 aspect-square group rounded-lg'>
            {product ? (
                <>
                    <a className='w-full h-full rounded-lg' draggable='false'>
                        <Img src={toUrl(product.imagePath)} alt={product.name} className='w-full aspect-square rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300' />
                    </a>
                    <div className='flex group-hover:opacity-100 transition-opacity duration-300 md:opacity-0 p-2 flex-col -translate-y-full text-end items-end w-full rounded-b-lg bg-black bg-opacity-25'>
                        <a className='text-2xl font-bold text-white mb-2 tracking-tight'>{product.name}</a>
                        <button
                            id='favs'
                            className={`w-10 aspect-square grid place-items-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 rounded-lg ${
                                favsList?.some((p) => p._id === product._id) ? 'text-yellow-400' : 'text-slate-200 hover:text-slate-50'
                            }`}
                            onClick={handleFavorite}
                        >
                            <HeartIcon className='w-6 h-6' />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <a className='w-full h-full rounded-lg' draggable='false'>
                        <Img src={'/productPlaceholder.jpg'} alt='Loading' className='w-full aspect-square rounded-[20%] animate-pulse duration-300' />
                    </a>
                </>
            )}
        </div>
    );
};

export default ProductCard;
