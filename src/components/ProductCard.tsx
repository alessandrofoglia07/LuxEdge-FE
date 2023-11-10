import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { HeartIcon } from '@heroicons/react/20/solid';
import Img from './CustomElements/CustomImg';
import toUrl from '@/utils/toUrl';
import useAuth from '@/hooks/useAuth';
import authAxios from '@/api/authAxios';
import { toPlural } from '@/utils/singularPlural';

interface Props {
    product: Product;
    isFavorite: boolean;
    setIsFavorite: (val: boolean, _id: string) => void;
}

const ProductCard: React.FC<Props> = (_: Props) => {
    const isAuth = useAuth();

    const [product, setProduct] = useState<Product>(_.product);

    const handleFavorite = async () => {
        // if product is in favs
        if (_.isFavorite) {
            if (isAuth) {
                await authAxios.patch(`/lists/favorites/remove/${product._id}`);
            }
            _.setIsFavorite(false, product._id);
        } else {
            if (isAuth) {
                await authAxios.patch(`/lists/favorites/add/${product._id}`);
            }
            _.setIsFavorite(true, product._id);
        }
    };

    useEffect(() => {
        setProduct(_.product);
    }, [_]);

    return (
        <div id='ProductCard' className='group aspect-square h-64 w-64 rounded-lg md:h-96 md:w-96'>
            <a className='h-full w-full rounded-lg' href={`/products/${toPlural(product.category)}/${product.name}`} draggable='false'>
                <Img src={toUrl(product.imagePath)} alt={product.name} className='aspect-square w-full rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl' />
            </a>
            <div className='flex w-full -translate-y-full flex-col items-end rounded-b-lg bg-black bg-opacity-25 p-2 text-end transition-opacity duration-300 group-hover:opacity-100 md:opacity-0'>
                <a className='mb-2 text-2xl font-bold tracking-tight text-white' href={`/products/${toPlural(product.category)}/${product.name}`}>
                    {product.name}
                </a>
                <button
                    id='favs'
                    className={`group/btn grid aspect-square w-10 place-items-center rounded-lg bg-black bg-opacity-20 transition-all duration-200 hover:bg-opacity-30 ${
                        _.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-slate-200 hover:text-slate-50'
                    }`}
                    onClick={handleFavorite}>
                    <HeartIcon className='h-6 w-6 transition-transform group-hover/btn:scale-110 group-active/btn:scale-95' />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
