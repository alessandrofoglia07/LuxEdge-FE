/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { HeartIcon } from '@heroicons/react/20/solid';
import Img from './CustomElements/CustomImg';
import { useNavigate } from 'react-router-dom';
import toUrl from '@/utils/toUrl';
import getFavsList from '@/utils/getFavsList';
import useAuth from '@/hooks/useAuth';

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = (_: Props) => {
    const isAuth = useAuth();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [favsList, setFavsList] = useState<Product[] | null>(null);

    const handleFavorite = async () => {
        if (!isAuth) {
            navigate('/login');
        } else {
            // TODO: add
            console.log(product, 'Product fav clicked');
        }
    };

    useEffect(() => {
        (async () => {
            if (isAuth) {
                const favs = await getFavsList();
                setFavsList(favs || []);
            }
        })();
    }, [isAuth]);

    useEffect(() => {
        setProduct(_.product);
    }, [_]);

    return (
        <div id='ProductCard' className='md:w-96 md:h-96 w-64 h-64 aspect-square group rounded-lg'>
            {product ? (
                <>
                    <a className='w-full h-full rounded-lg' href={`/products/details/${product.name}`} draggable='false'>
                        <Img src={toUrl(product.imagePath)} alt={product.name} className='w-full aspect-square rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300' />
                    </a>
                    <div className='flex group-hover:opacity-100 transition-opacity duration-300 md:opacity-0 p-2 flex-col -translate-y-full text-end items-end w-full rounded-b-lg bg-black bg-opacity-25'>
                        <a className='text-2xl font-bold text-white mb-2 tracking-tight' href={`/products/details/${product.name}`}>
                            {product.name}
                        </a>
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
