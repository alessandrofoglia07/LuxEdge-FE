import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { HeartIcon } from '@heroicons/react/20/solid';
import Img from './CustomElements/CustomImg';
import toUrl from '@/utils/toUrl';
import useAuth from '@/hooks/useAuth';
import authAxios from '@/api/authAxios';

interface Props {
    product: Product;
    isFavorite: boolean;
    setIsFavorite: (val: boolean, _id: string) => void;
}

const ProductCard: React.FC<Props> = (_: Props) => {
    const isAuth = useAuth();

    const [product, setProduct] = useState<Product>(_.product);

    const handleFavorite = async () => {
        // TODO: handle this
        if (!isAuth) return;

        // if product is in favs
        if (_.isFavorite) {
            await authAxios.patch(`/lists/favorites/remove/${product._id}`);
            _.setIsFavorite(false, product._id);
        } else {
            // add to favs
            if (!_.isFavorite) {
                await authAxios.patch(`/lists/favorites/add/${product._id}`);
                _.setIsFavorite(true, product._id);
            }
        }
    };

    useEffect(() => {
        setProduct(_.product);
    }, [_]);

    return (
        <div id='ProductCard' className='md:w-96 md:h-96 w-64 h-64 aspect-square group rounded-lg'>
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
                        _.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-slate-200 hover:text-slate-50'
                    }`}
                    onClick={handleFavorite}
                >
                    <HeartIcon className='w-6 h-6' />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
