import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import Rating from './Rating';
import { HeartIcon } from '@heroicons/react/20/solid';
import Img from './CustomElements/CustomImg';
import toUrl from '@/utils/toUrl';
import useAuth from '@/hooks/useAuth';
import authAxios from '@/api/authAxios';
import toPrice from '@/utils/toPrice';
import { toPlural } from '@/utils/singularPlural';

interface Props {
    product: Product;
    isFavorite: boolean;
    setIsFavorite: (val: boolean, _id: string) => void;
}

const ProductCard: React.FC<Props> = (_: Props) => {
    const isAuth = useAuth();

    const [product, setProduct] = useState<Product>(_.product);

    useEffect(() => {
        setProduct(_.product);
    }, [_]);

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

    return (
        <div id='ProductCard' className='flex w-min flex-col items-center rounded-lg bg-white p-4 md:h-fit md:w-96 md:min-w-[24rem]'>
            <div id='top' className='group h-64 w-full md:h-1/2 md:w-full'>
                <a draggable={false} className='h-full w-full md:pt-4' href={`/products/${toPlural(product.category)}/${product.name}`}>
                    <Img className='h-full w-full rounded-md border-2 border-slate-200 drop-shadow-xl' src={toUrl(product.imagePath)} alt={product.name} />
                </a>
                <div className='absolute flex -translate-y-full flex-col items-end rounded-b-lg p-2 text-end transition-opacity duration-300 group-hover:opacity-100 md:opacity-0'>
                    <button
                        id='favs'
                        className={`group/btn grid aspect-square w-10 place-items-center rounded-lg bg-black bg-opacity-60 transition-all duration-200 ${
                            _.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-slate-200 hover:text-slate-50'
                        }`}
                        onClick={handleFavorite}>
                        <HeartIcon className='h-6 w-6 transition-transform group-hover/btn:scale-110 group-active/btn:scale-95' />
                    </button>
                </div>
            </div>
            <div id='rows-container' className='flex h-min w-64 flex-col gap-1 px-4 md:h-1/2 md:w-full md:pt-4'>
                <div className='flex justify-between'>
                    {product.category && <p className='uppercase tracking-wide text-primary-light opacity-70'>{product.category}</p>}
                    {product.rating && <Rating rating={product.rating} />}
                </div>
                <a draggable={false} href={`/products/${toPlural(product.category)}/${product.name}`} className='font-bold capitalize tracking-wide'>
                    {product.name}
                </a>
                <h6 className='font-semibold tracking-wide'>{toPrice(product.price)}</h6>
            </div>
        </div>
    );
};

export default ProductCard;
