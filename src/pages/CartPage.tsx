import React, { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Product } from '@/types';
import Img from '@/components/CustomElements/CustomImg';
import toUrl from '@/utils/toUrl';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authAxios from '@/api/authAxios';
import { AxiosError } from 'axios';
import Spinner from '@/components/Spinner';
import { CheckIcon, XMarkIcon, XCircleIcon } from '@heroicons/react/20/solid';
import toPrice from '@/utils/toPrice';

interface ProductCardProps {
    product: Product;
    handleRemove: (id: string) => void;
}

const ProductCardDesktop = ({ product, handleRemove }: ProductCardProps) => (
    <div className='[&>*]:font-semibold [&>*]:tracking-wide [&>*]:text-start flex items-center'>
        <div className='w-5/12 flex items-center'>
            <a className='rounded-lg' href={`/procuts/details/${product.name}`}>
                <Img src={toUrl(product.imagePath)} alt={product.name} className='w-48 min-w-[6rem] aspect-square rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300' />
            </a>
            <a href={`/procuts/details/${product.name}`} className='pl-8 text-xl tracking-wide'>
                {product.name}
            </a>
        </div>
        <div className='flex items-center justify-evenly w-5/12 [&>*]:font-normal'>
            <h6 className='capitalize text-start w-2/4'>{product.category}</h6>
            {product.available ? (
                <div className='flex items-center justify-center w-1/6'>
                    <CheckIcon className='w-8' />
                </div>
            ) : (
                <div className='flex items-center justify-center w-1/6'>
                    <XMarkIcon className='w-8' />
                </div>
            )}
            <h6 className='text-end w-2/6'>{toPrice(product.price)}</h6>
        </div>
        <div className='w-2/12 flex items-center justify-center'>
            <button className='rounded-full' onClick={() => handleRemove(product._id)}>
                <XCircleIcon aria-label='Remove from cart' className='w-8' />
            </button>
        </div>
    </div>
);

const ProductCardMobile = ({ product, handleRemove }: ProductCardProps) => (
    <div className='[&>*]:font-semibold [&>*]:tracking-wide [&>*]:text-start flex items-center'>
        <a className='rounded-lg w-4/12' href={`/procuts/details/${product.name}`}>
            <Img src={toUrl(product.imagePath)} alt={product.name} className='w-full aspect-square rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300' />
        </a>
        <div className='w-6/12 flex flex-col pl-8'>
            <a href={`/procuts/details/${product.name}`} className='text-md tracking-tight'>
                {product.name}
            </a>
            <h6 className='capitalize text-start opacity-70'>{product.category}</h6>
            <h6 className='text-end'>{toPrice(product.price)}</h6>
        </div>
        <div className='w-2/12 flex items-center justify-center'>
            <button className='rounded-full' onClick={() => handleRemove(product._id)}>
                <XCircleIcon aria-label='Remove from cart' className='w-8' />
            </button>
        </div>
    </div>
);

const TotalPriceItem = ({ children, price, className = '' }: { children: React.ReactNode; price: number; className?: string }) => (
    <div className={`flex justify-between items-center ${className}`}>
        <h4 className='text-xl font-semibold'>{children}</h4>
        <h4 className='text-xl font-semibold'>{toPrice(price)}</h4>
    </div>
);

const TotalPrice = ({ products }: { products: Product[] }) => {
    const [subtotal, setSubtotal] = useState<number>(0);
    const [shipping, setShipping] = useState<number>(0);
    const [tax, setTax] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        const subtotal = products.reduce((acc, curr) => acc + curr.price, 0);
        const shipping = 0;
        const tax = 0;
        setSubtotal(subtotal);
        setShipping(shipping);
        setTax(tax);
        setTotalPrice(subtotal + shipping + tax);
    }, [products]);

    return (
        <div className='w-1/3 h-fit flex flex-col px-8 border-l-2'>
            <h2 className='text-3xl font-extrabold tracking-wide pb-4 border-b-2'>Summary</h2>
            <TotalPriceItem className='pt-8' price={subtotal}>
                Subtotal ({products.length} items)
            </TotalPriceItem>
            <TotalPriceItem className='pt-4' price={shipping}>
                Shipping
            </TotalPriceItem>
            <TotalPriceItem className='pt-4' price={tax}>
                Tax
            </TotalPriceItem>
            <div className='pt-8 flex justify-between'>
                <div className='flex flex-col text-start items-start'>
                    <h4 className='font-bold text-xl'>Total</h4>
                    <h4 className='font-extrabold text-2xl'>{toPrice(totalPrice)}</h4>
                </div>
                <button className='w-1/2 h-12 bg-primary-light rounded-lg text-white font-semibold'>Proceed to checkout</button>
            </div>
        </div>
    );
};

const CartPage: React.FC = () => {
    const isAuth = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
        }

        (async () => {
            setLoading(true);
            try {
                const cart = await authAxios.get('/lists/cart/products');

                setProducts(cart.data);
            } catch (err: unknown) {
                if (err instanceof AxiosError) {
                    throw err.response?.data;
                } else if (err instanceof Error) {
                    throw err;
                } else if (typeof err === 'string') {
                    throw new Error(err);
                } else {
                    console.log(err);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [isAuth]);

    const handleRemoveProduct = async (id: string) => {
        try {
            await authAxios.patch(`/lists/cart/remove/${id}`);

            setProducts((prev) => prev.filter((product) => product._id !== id));
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                throw err.response?.data;
            } else if (err instanceof Error) {
                throw err;
            } else if (typeof err === 'string') {
                throw new Error(err);
            } else {
                console.log(err);
            }
        }
    };

    return (
        <div id='  CartPage'>
            <Navbar />
            <main className='py-16 min-h-page'>
                {loading ? (
                    <div className='absolute right-1/2 -translate-x-1/2'>
                        <Spinner className='mt-[20vh]' />
                    </div>
                ) : (
                    <>
                        <h2 className='font-extrabold text-5xl -md:text-3xl tracking-tight mt-6 ml-10'>Shopping cart</h2>
                        {/* DESKTOP */}
                        <div className='w-full flex -md:hidden'>
                            <div className='w-2/3 px-10 mt-8'>
                                <div id='table-header' className='border-b-2 pb-3'>
                                    <div className='[&>*]:font-semibold [&>*]:tracking-wide [&>*]:text-start flex items-center'>
                                        <h6 className='w-5/12'>Added Items</h6>
                                        <div className='flex items-center justify-evenly w-5/12'>
                                            <h6 className='text-start w-2/4'>Category</h6>
                                            <h6 className='text-center w-1/6'>Available</h6>
                                            <h6 className='text-end w-2/6'>Price</h6>
                                        </div>
                                        <div className='w-2/12' />
                                    </div>
                                </div>
                                <div id='table-body' className='flex flex-col gap-8'>
                                    {products.length === 0 ? (
                                        <h3 className='absolute left-1/2 -translate-x-1/2 pt-[20vh] text-center font-bold text-2xl'>No products found</h3>
                                    ) : (
                                        products.map((products) => <ProductCardDesktop handleRemove={handleRemoveProduct} product={products} key={products._id} />)
                                    )}
                                </div>
                            </div>
                            <TotalPrice products={products} />
                        </div>
                        {/* MOBILE */}
                        {/* TODO: MAKE THE PAGE RESPONSIVE */}
                        <div className='w-full flex md:hidden'>
                            <div className='w-full px-2 mt-4 pt-4 border-t-2'>
                                {products.length === 0 ? (
                                    <h3 className='text-center font-bold text-2xl -md:text-xl'>No products found</h3>
                                ) : (
                                    <div className='flex items-center flex-col gap-4'>
                                        {products.map((products) => (
                                            <ProductCardMobile handleRemove={handleRemoveProduct} product={products} key={products._id} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;
