import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import Highlight from './Highlight';
import Rating from './Rating';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/20/solid';

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = (_: Props) => {
    const [product, setProduct] = useState<Product | null>(null);

    const toUrl = (path: string) => {
        return `${import.meta.env.VITE_API_URL}/${path}`;
    };

    useEffect(() => {
        setProduct(_.product);
        console.log(_.product);
    }, [_]);

    return (
        <div id='ProductCard' className='w-96 h-[38rem] bg-white rounded-lg'>
            {product ? (
                <>
                    <div id='top' className='w-full h-1/2 flex justify-center items-center pt-4'>
                        <img
                            className='h-[calc(100%-1rem)] w-[calc(100%-5rem)] object-cover rounded-lg border-slate-200 drop-shadow-xl border-2'
                            src={toUrl(product.imagePath)}
                            alt={product.name}
                        />
                    </div>
                    <div id='center' className='py-8 flex flex-col items-center'>
                        <h1 className='font-extrabold text-3xl tracking-wider select-none'>{product.name}</h1>
                        <p className='font-semibold opacity-50 pt-2'>{product.description}</p>
                        <h4 className='font-bold text-3xl py-6 select-none'>
                            <Highlight>${product.price}</Highlight>
                        </h4>
                        <div id='score'>
                            <Rating rating={product.score} />
                        </div>
                    </div>
                    <div id='bottom' className='w-full h-12 flex justify-evenly lg:px-2'>
                        <button id='cart' className='w-2/3 bg-primary-base hover:bg-primary-hover h-full flex items-center justify-evenly text-white rounded-lg lg:px-8'>
                            Add to Cart <ShoppingCartIcon className='w-6 h-6' />
                        </button>
                        {/* TODO: If product already is in user's favs list, make text-yellow-xxx */}
                        <button id='favs' className='h-full aspect-square grid place-items-center bg-primary-light hover:bg-primary-base rounded-lg text-white'>
                            <StarIcon className='w-6 h-6' />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {/* TODO: add placeholder component */}
                    <div id='top'></div>
                    <div id='center'></div>
                    <div id='bottom'></div>
                </>
            )}
        </div>
    );
};

export default ProductCard;
