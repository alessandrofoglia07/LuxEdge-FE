import React, { useState, useEffect } from 'react';
import useSelector from '@/hooks/useSelector';
import { Product } from '@/types';
import Highlight from './Highlight';
import Rating from './Rating';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/20/solid';
import authAxios from '@/api/authAxios';
import Img from './CustomImg';

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

    const Container = ({ children }: { children: React.ReactNode }) => (
        <div id='ProductCard' className='md:w-96 flex flex-col items-center md:min-w-[24rem] md:h-[36rem] w-min h-[28rem] bg-white rounded-lg'>
            {children}
        </div>
    );

    {
        /* TODO: Make the component responsive when product is undefined */
    }
    return (
        <Container>
            {product ? (
                <>
                    <div id='top' className='md:w-full md:h-1/2 w-48 h-48 flex justify-center items-center md:pt-4'>
                        <Img
                            className='md:h-[calc(100%-1rem)] md:w-[calc(100%-5rem)] w-full h-full rounded-lg border-slate-200 drop-shadow-xl border-2'
                            src={toUrl(product.imagePath)}
                            alt={product.name}
                        />
                    </div>
                    <div id='center' className='md:py-8 py-2 flex flex-col items-center'>
                        <a href={`/products/${product.name}`} className='font-extrabold md:text-3xl text-2xl tracking-wider select-none'>
                            {product.name}
                        </a>
                        <p className='font-semibold opacity-50 md:pt-2'>{product.description}</p>
                        <h4 className='font-bold md:text-3xl text-2xl md:py-4 py-2 select-none'>
                            <Highlight>${product.price}</Highlight>
                        </h4>
                        <div id='score'>
                            <Rating rating={product.score} />
                        </div>
                    </div>
                    <div id='bottom' className='w-full h-12 flex justify-evenly lg:px-2'>
                        <button id='cart' className='w-2/3 bg-primary-base hover:bg-primary-hover h-full flex items-center justify-evenly text-white rounded-lg lg:px-8'>
                            <span className='-md:hidden'>Add to Cart </span>
                            <ShoppingCartIcon className='w-6 h-6' />
                        </button>
                        <button
                            id='favs'
                            className={`h-full aspect-square grid place-items-center bg-primary-light hover:bg-primary-base rounded-lg ${
                                favsList?.some((p) => p._id === product._id) ? 'text-yellow-400' : 'text-white'
                            }`}>
                            <StarIcon className='w-6 h-6' />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div id='top' className='w-full h-1/2 flex justify-center items-center pt-4'>
                        <Img
                            className='h-[calc(100%-1rem)] w-[calc(100%-5rem)] rounded-lg border-slate-200 drop-shadow-xl border-2 animate-pulse'
                            src='/productPlaceholder.jpg'
                            alt='placeholder'
                        />
                    </div>
                    <div id='center' className='py-8 flex flex-col items-center'>
                        <div className='font-extrabold text-3xl tracking-wider select-none animate-pulse bg-slate-300 text-slate-300 my-2 rounded-xl'>placeholder</div>
                        <div className='font-semibold opacity-50 animate-pulse bg-slate-300 text-slate-300 rounded-xl'>You will soon see the product</div>
                        <h4 className='font-bold text-3xl py-4 select-none text-slate-400 animate-pulse'>$100</h4>
                        <div id='score'>
                            <Rating rating={5} />
                        </div>
                    </div>
                    <div id='bottom' className='w-full h-12 flex justify-evenly lg:px-2'>
                        <button id='cart' className='w-2/3 bg-slate-400 h-full flex items-center justify-evenly text-white rounded-lg lg:px-8 animate-pulse' disabled>
                            Add to Cart <ShoppingCartIcon className='w-6 h-6' />
                        </button>
                        <button id='favs' className='h-full aspect-square grid place-items-center bg-slate-300 rounded-lg text-white animate-pulse' disabled>
                            <StarIcon className='w-6 h-6' />
                        </button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default ProductCard;
