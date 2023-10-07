import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import Rating from './Rating';
import { HeartIcon } from '@heroicons/react/20/solid';
import Img from './CustomElements/CustomImg';
import toUrl from '@/utils/toUrl';
import useAuth from '@/hooks/useAuth';
import authAxios from '@/api/authAxios';
import toPrice from '@/utils/toPrice';

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

    const Container = ({ children }: { children: React.ReactNode }) => (
        <div id='ProductCard' className='md:w-96 flex flex-col items-center md:min-w-[24rem] md:h-fit w-min bg-white rounded-lg p-4'>
            {children}
        </div>
    );

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
        <Container>
            <div id='top' className='md:w-full md:h-1/2 w-full h-64 group'>
                <a draggable={false} className='w-full h-full md:pt-4' href={`/products/details/${product.name}`}>
                    <Img className='w-full h-full rounded-md border-slate-200 drop-shadow-xl border-2' src={toUrl(product.imagePath)} alt={product.name} />
                </a>
                <div className='absolute flex group-hover:opacity-100 transition-opacity duration-300 md:opacity-0 p-2 flex-col -translate-y-full text-end items-end rounded-b-lg'>
                    <button
                        id='favs'
                        className={`w-10 aspect-square grid place-items-center bg-black bg-opacity-60 transition-all duration-200 rounded-lg ${
                            _.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-slate-200 hover:text-slate-50'
                        }`}
                        onClick={handleFavorite}
                    >
                        <HeartIcon className='w-6 h-6' />
                    </button>
                </div>
            </div>
            <div id='rows-container' className='md:w-full md:h-1/2 w-64 h-min flex flex-col md:pt-4 px-4 gap-1'>
                <div className='flex justify-between'>
                    {product.category && <p className='uppercase tracking-wide text-primary-light opacity-70'>{product.category}</p>}
                    {product.rating && <Rating rating={product.rating} />}
                </div>
                <a draggable={false} href={`/products/details/${product.name}`} className='capitalize font-bold tracking-wide'>
                    {product.name}
                </a>
                <h6 className='font-semibold tracking-wide'>{toPrice(product.price)}</h6>
            </div>
        </Container>
    );
};

export default ProductCard;
