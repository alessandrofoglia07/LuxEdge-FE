import React, { useState, useEffect } from 'react';
import useSelector from '@/hooks/useSelector';
import { Product } from '@/types';
import Rating from './Rating';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/20/solid';
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

    const Container = ({ children }: { children: React.ReactNode }) => (
        <div id='ProductCard' className='md:w-96 flex flex-col items-center md:min-w-[24rem] md:min-h-[36rem] md:h-fit w-min h-[28rem] bg-white rounded-lg p-4'>
            {children}
        </div>
    );

    const toPrice = (price: number) => {
        if (Number.isInteger(price) && price > 0) {
            return `$ ${price}.00`;
        } else if (price > 0) {
            return `$ ${price.toFixed(2)}`;
        } else {
            return `$ 0.00`;
        }
    };

    {
        /* TODO: Make the component responsive when product is undefined */
    }

    return (
        <Container>
            {product ? (
                <>
                    <div id='top' className='md:w-full md:h-1/2 w-48 h-48 group'>
                        <a draggable={false} className='w-full h-full md:pt-4' href={`/products/details/${product.name}`}>
                            <Img className='w-full h-full rounded-md border-slate-200 drop-shadow-xl border-2' src={toUrl(product.imagePath)} alt={product.name} />
                        </a>
                        <div className='absolute flex group-hover:opacity-100 transition-opacity duration-300 md:opacity-0 p-2 flex-col -translate-y-full text-end items-end rounded-b-lg'>
                            <button
                                id='favs'
                                className={`w-10 aspect-square grid place-items-center bg-black bg-opacity-60 transition-all duration-200 rounded-lg ${
                                    favsList?.some((p) => p._id === product._id) ? 'text-yellow-400' : 'text-slate-200 hover:text-slate-50'
                                }`}
                            >
                                <HeartIcon className='w-6 h-6' />
                            </button>
                        </div>
                    </div>
                    <div id='rows-container' className='md:w-full md:h-1/2 w-48 h-48 flex flex-col md:pt-4 px-4 gap-1'>
                        <div className='flex justify-between'>
                            {product.tags[0] && <p className='uppercase tracking-wide text-primary-light opacity-70'>{product.tags[0]}</p>}
                            {product.rating && <Rating rating={product.rating} />}
                        </div>
                        <a draggable={false} href={`/products/details/${product.name}`} className='capitalize font-bold tracking-wide'>
                            {product.name}
                        </a>
                        <h6 className='font-semibold tracking-wide'>{toPrice(product.price)}</h6>
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
                            <HeartIcon className='w-6 h-6' />
                        </button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default ProductCard;
