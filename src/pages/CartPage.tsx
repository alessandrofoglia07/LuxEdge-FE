import React, { useState, useEffect, Fragment } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Product } from '@/types';
import Img from '@/components/CustomElements/CustomImg';
import toUrl from '@/utils/toUrl';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authAxios from '@/api/authAxios';
import Spinner from '@/components/Spinner';
import { CheckIcon, XMarkIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/20/solid';
import toPrice from '@/utils/toPrice';
import Pagination from '@/components/Pagination';
import { toPlural } from '@/utils/singularPlural';
import { motion } from 'framer-motion';
import NotificationsMenu from '@/components/NotificationsMenu';
import { Dialog, Transition } from '@headlessui/react';
import useErrHandler from '@/hooks/useErrHandler';

interface ProductCardProps {
    product: Product;
    handleAdd: (id: string) => void;
    handleRemove: (id: string) => void;
    quantity?: number;
}

const ProductCardDesktop = ({ product, handleAdd, handleRemove, quantity = 1 }: ProductCardProps) => (
    <div className='flex items-center [&>*]:text-start [&>*]:font-semibold [&>*]:tracking-wide'>
        <div className='flex w-5/12 items-center'>
            <a className='w-1/3 rounded-lg' href={`/products/${toPlural(product.category)}/${product.name}`}>
                <Img src={toUrl(product.imagePath)} alt={product.name} className='aspect-square w-full rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl' />
            </a>
            <a href={`/products/${toPlural(product.category)}/${product.name}`} className='w-2/3 px-4 text-xl tracking-wide'>
                {product.name}
            </a>
        </div>
        <div className='flex w-5/12 items-center justify-evenly [&>*]:font-normal'>
            <h6 className='w-2/4 text-start capitalize'>{product.category}</h6>
            {product.available ? (
                <div className='flex w-1/6 items-center justify-center'>
                    <CheckIcon className='w-8' />
                </div>
            ) : (
                <div className='flex w-1/6 items-center justify-center'>
                    <XMarkIcon className='w-8' />
                </div>
            )}
            <h6 className='w-2/6 text-end'>{toPrice(product.price)}</h6>
        </div>
        <div className='flex w-2/12 items-center justify-center'>
            <div className='flex w-full flex-col items-center'>
                <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className='rounded-full focus:outline-none' onClick={() => handleAdd(product._id)}>
                    <XCircleIcon aria-label='Add item to cart' className='w-8 -rotate-45' />
                </motion.button>
                <h6 className='text-center font-extrabold'>{quantity}</h6>
                <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className='rounded-full focus:outline-none' onClick={() => handleRemove(product._id)}>
                    <MinusCircleIcon aria-label='Remove from cart' className='w-8' />
                </motion.button>
            </div>
        </div>
    </div>
);

const ProductCardMobile = ({ product, handleAdd, handleRemove, quantity = 1 }: ProductCardProps) => (
    <div className='flex items-center [&>*]:text-start [&>*]:font-semibold [&>*]:tracking-wide'>
        <a className='w-4/12 rounded-lg' href={`/products/${toPlural(product.category)}/${product.name}`}>
            <Img src={toUrl(product.imagePath)} alt={product.name} className='aspect-square w-full rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl' />
        </a>
        <div className='flex w-6/12 flex-col pl-8'>
            <a href={`/products/${toPlural(product.category)}/${product.name}`} className='text-lg tracking-tight'>
                {product.name}
            </a>
            <h6 className='text-start capitalize opacity-70'>{product.category}</h6>
            <h6 className='text-end'>{toPrice(product.price)}</h6>
        </div>
        <div className='flex w-2/12 items-center justify-center'>
            <div className='flex w-full flex-col items-center'>
                <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className='rounded-full focus:outline-none' onClick={() => handleAdd(product._id)}>
                    <XCircleIcon aria-label='Add item to cart' className='w-8 -rotate-45' />
                </motion.button>
                <h6 className='text-center font-extrabold'>{quantity}</h6>
                <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} className='rounded-full focus:outline-none' onClick={() => handleRemove(product._id)}>
                    <MinusCircleIcon aria-label='Remove from cart' className='w-8' />
                </motion.button>
            </div>
        </div>
    </div>
);

const TotalPriceItem = ({ children, price, className = '' }: { children: React.ReactNode; price: number; className?: string }) => (
    <div className={`flex items-center justify-between ${className}`}>
        <h4 className='text-xl font-semibold tracking-tight'>{children}</h4>
        <h4 className='text-xl font-semibold tracking-tight'>{toPrice(price)}</h4>
    </div>
);

const TotalPriceItemMobile = ({ children, price, className = '', bold }: { children: React.ReactNode; price: number; className?: string; bold?: boolean }) => (
    <div className={`flex items-center justify-between ${className} ${bold && '[&>*]:!font-bold'}`}>
        <h4 className='text-md tracking-tight'>{children}</h4>
        <h4 className='text-md tracking-tight'>{toPrice(price)}</h4>
    </div>
);

const TotalPrice = ({ products, onCheckout }: { products: Product[]; onCheckout: () => void }) => {
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
        <div className='flex h-fit w-1/3 flex-col border-l-2 px-8'>
            <h2 className='border-b-2 pb-4 text-3xl font-extrabold tracking-wide'>Summary</h2>
            <TotalPriceItem className='pt-8' price={subtotal}>
                Subtotal ({products.length} items)
            </TotalPriceItem>
            <TotalPriceItem className='pt-4' price={shipping}>
                Shipping
            </TotalPriceItem>
            <TotalPriceItem className='pt-4' price={tax}>
                Tax
            </TotalPriceItem>
            <div className='flex justify-between pt-8'>
                <div className='flex flex-col items-start text-start'>
                    <h4 className='text-xl font-bold'>Total</h4>
                    <h4 className='text-2xl font-extrabold'>{toPrice(totalPrice)}</h4>
                </div>
                <button onClick={onCheckout} className='h-12 w-1/2 rounded-lg bg-primary-light font-semibold text-white transition-shadow hover:shadow-xl'>
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
};

const TotalPriceMobile = ({ products, onCheckout }: { products: Product[]; onCheckout: () => void }) => {
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
        <div className='sticky bottom-0 left-0 z-50 mt-16 h-min w-full border-b-2 border-t-2 bg-slate-100 px-8 lg:hidden'>
            <TotalPriceItemMobile className='pt-8' price={subtotal}>
                Subtotal ({products.length} items)
            </TotalPriceItemMobile>
            <TotalPriceItemMobile className='pt-2' price={shipping}>
                Shipping
            </TotalPriceItemMobile>
            <TotalPriceItemMobile className='pt-2' price={tax}>
                Tax
            </TotalPriceItemMobile>
            <TotalPriceItemMobile bold className='pt-3' price={totalPrice}>
                Total
            </TotalPriceItemMobile>
            <button onClick={onCheckout} className='my-12 h-12 w-full rounded-lg bg-primary-light font-semibold text-white shadow-xl'>
                Proceed to checkout
            </button>
        </div>
    );
};

const PRODUCTS_PER_PAGE = 6;
type AccumulatorType = (Product & { quantity: number })[];

const CartPage: React.FC = () => {
    const isAuth = useAuth();
    const navigate = useNavigate();
    const handleErr = useErrHandler();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [waiting, setWaiting] = useState<boolean>(false);

    const groupedProducts = products.reduce((acc: AccumulatorType, product) => {
        const existingProduct = acc.find((p) => p._id === product._id);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            const newProduct = { ...product, quantity: 1 };
            acc.push(newProduct);
        }

        return acc;
    }, []);

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
                handleErr(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [isAuth]);

    const handleAddProduct = async (id: string) => {
        try {
            await authAxios.patch(`/lists/cart/add/${id}`);
            const res = await authAxios.get('/lists/cart/products');
            setProducts(res.data);
        } catch (err: unknown) {
            handleErr(err);
        }
    };

    const handleRemoveProduct = async (id: string) => {
        try {
            await authAxios.patch(`/lists/cart/remove/${id}`);

            setProducts((prev) => {
                const index = prev.findIndex((product) => product._id === id);
                prev.splice(index, 1);
                return [...prev];
            });
        } catch (err: unknown) {
            handleErr(err);
        }
    };

    const handlePageChange = (page: number) => {
        setPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCheckout = async () => {
        setWaiting(true);
        try {
            const res = await authAxios.post('/payment/create-checkout-session');
            window.location.href = res.data.url;
        } catch (err: unknown) {
            handleErr(err);
        }
    };

    return (
        <div id='CartPage'>
            <Navbar />
            <main className='min-h-page py-16'>
                {loading ? (
                    <div className='absolute left-1/2 -translate-x-1/2'>
                        <Spinner className='mt-[20vh]' />
                    </div>
                ) : (
                    <>
                        <h2 className='ml-10 mt-6 text-5xl font-extrabold tracking-tight -md:text-3xl'>Shopping cart</h2>
                        <h4 className='ml-10 mt-2 text-xl font-semibold text-gray-600'>You can complete your order here.</h4>
                        {/* DESKTOP */}
                        <div className='flex w-full -lg:hidden'>
                            <div className='mt-8 w-2/3 max-w-7xl px-10'>
                                <div id='table-header' className='border-b-2 pb-3'>
                                    <div className='flex items-center [&>*]:text-start [&>*]:font-semibold [&>*]:tracking-wide'>
                                        <h6 className='w-5/12'>Added Items</h6>
                                        <div className='flex w-5/12 items-center justify-evenly'>
                                            <h6 className='w-2/4 text-start'>Category</h6>
                                            <h6 className='w-1/6 text-center'>Available</h6>
                                            <h6 className='w-2/6 text-end'>Price</h6>
                                        </div>
                                        <div className='w-2/12' />
                                    </div>
                                </div>
                                <div id='table-body' className='flex flex-col gap-8'>
                                    {products.length === 0 ? (
                                        <h3 className='relative left-1/2 -translate-x-1/2 pt-[20vh] text-center text-2xl font-bold'>No products found</h3>
                                    ) : (
                                        groupedProducts
                                            .slice((page - 1) * PRODUCTS_PER_PAGE, (page - 1) * PRODUCTS_PER_PAGE + PRODUCTS_PER_PAGE)
                                            .map((product) => (
                                                <ProductCardDesktop
                                                    handleAdd={handleAddProduct}
                                                    quantity={product.quantity}
                                                    handleRemove={handleRemoveProduct}
                                                    product={product}
                                                    key={product._id}
                                                />
                                            ))
                                    )}
                                </div>
                            </div>
                            <TotalPrice products={products} onCheckout={handleCheckout} />
                        </div>
                        {/* MOBILE */}
                        <div className='flex w-full lg:hidden'>
                            <div className='mt-4 w-full border-t-2 px-2 pt-4'>
                                {products.length === 0 ? (
                                    <h3 className='text-center text-2xl font-bold'>No products found</h3>
                                ) : (
                                    <div className='flex flex-col items-center gap-6'>
                                        {groupedProducts.slice((page - 1) * PRODUCTS_PER_PAGE, (page - 1) * PRODUCTS_PER_PAGE + PRODUCTS_PER_PAGE).map((products) => (
                                            <ProductCardMobile handleAdd={handleAddProduct} handleRemove={handleRemoveProduct} product={products} key={products._id} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
                {products.length !== 0 && products.length > PRODUCTS_PER_PAGE && (
                    <Pagination className='justify-center' currentPage={page} onPageChange={handlePageChange} pageSize={PRODUCTS_PER_PAGE} totalCount={groupedProducts.length} />
                )}
            </main>
            <TotalPriceMobile products={products} onCheckout={handleCheckout} />
            <Footer />
            <Dialog open={waiting} onClose={() => {}}>
                <Transition
                    show={waiting}
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <div className='fixed inset-0 z-50 bg-black/25' />
                </Transition>
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <Spinner className='h-16 w-16' />
                </div>
            </Dialog>
            <NotificationsMenu />
        </div>
    );
};

export default CartPage;
