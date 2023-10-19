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
import { CheckIcon, XMarkIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/20/solid';
import toPrice from '@/utils/toPrice';
import Pagination from '@/components/Pagination';
import { toPlural } from '@/utils/singularPlural';

interface ProductCardProps {
    product: Product;
    handleAdd: (id: string) => void;
    handleRemove: (id: string) => void;
    quantity?: number;
}

const ProductCardDesktop = ({ product, handleAdd, handleRemove, quantity = 1 }: ProductCardProps) => (
    <div className='[&>*]:font-semibold [&>*]:tracking-wide [&>*]:text-start flex items-center'>
        <div className='w-5/12 flex items-center'>
            <a className='rounded-lg' href={`/products/${toPlural(product.category)}/${product.name}`}>
                <Img src={toUrl(product.imagePath)} alt={product.name} className='w-48 min-w-[6rem] aspect-square rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300' />
            </a>
            <a href={`/products/${toPlural(product.category)}/${product.name}`} className='px-8 text-xl tracking-wide'>
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
            <div className='w-full flex flex-col items-center'>
                <button className='rounded-full focus:outline-none' onClick={() => handleAdd(product._id)}>
                    <XCircleIcon aria-label='Add item to cart' className='w-8 -rotate-45' />
                </button>
                <h6 className='text-center font-extrabold'>{quantity}</h6>
                <button className='rounded-full focus:outline-none' onClick={() => handleRemove(product._id)}>
                    <MinusCircleIcon aria-label='Remove from cart' className='w-8' />
                </button>
            </div>
        </div>
    </div>
);

const ProductCardMobile = ({ product, handleAdd, handleRemove, quantity = 1 }: ProductCardProps) => (
    <div className='[&>*]:font-semibold [&>*]:tracking-wide [&>*]:text-start flex items-center'>
        <a className='rounded-lg w-4/12' href={`/products/${toPlural(product.category)}/${product.name}`}>
            <Img src={toUrl(product.imagePath)} alt={product.name} className='w-full aspect-square rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300' />
        </a>
        <div className='w-6/12 flex flex-col pl-8'>
            <a href={`/products/${toPlural(product.category)}/${product.name}`} className='text-lg tracking-tight'>
                {product.name}
            </a>
            <h6 className='capitalize text-start opacity-70'>{product.category}</h6>
            <h6 className='text-end'>{toPrice(product.price)}</h6>
        </div>
        <div className='w-2/12 flex items-center justify-center'>
            <div className='w-full flex flex-col items-center'>
                <button className='rounded-full focus:outline-none' onClick={() => handleAdd(product._id)}>
                    <XCircleIcon aria-label='Add item to cart' className='w-8 -rotate-45' />
                </button>
                <h6 className='text-center font-extrabold'>{quantity}</h6>
                <button className='rounded-full focus:outline-none' onClick={() => handleRemove(product._id)}>
                    <MinusCircleIcon aria-label='Remove from cart' className='w-8' />
                </button>
            </div>
        </div>
    </div>
);

const TotalPriceItem = ({ children, price, className = '' }: { children: React.ReactNode; price: number; className?: string }) => (
    <div className={`flex justify-between items-center ${className}`}>
        <h4 className='text-xl tracking-tight font-semibold'>{children}</h4>
        <h4 className='text-xl tracking-tight font-semibold'>{toPrice(price)}</h4>
    </div>
);

const TotalPriceItemMobile = ({ children, price, className = '', bold }: { children: React.ReactNode; price: number; className?: string; bold?: boolean }) => (
    <div className={`flex justify-between items-center ${className} ${bold && '[&>*]:!font-bold'}`}>
        <h4 className='text-md tracking-tight'>{children}</h4>
        <h4 className='text-md tracking-tight'>{toPrice(price)}</h4>
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
                <button className='w-1/2 h-12 bg-primary-light rounded-lg text-white font-semibold hover:shadow-xl transition-shadow'>Proceed to checkout</button>
            </div>
        </div>
    );
};

const TotalPriceMobile = ({ products }: { products: Product[] }) => {
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
        <div className='w-full lg:hidden h-min sticky bottom-0 mt-16 left-0 px-8 bg-slate-100 border-b-2 border-t-2 z-50'>
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
            <button className='w-full h-12 my-12 shadow-xl bg-primary-light rounded-lg text-white font-semibold'>Proceed to checkout</button>
        </div>
    );
};

const PRODUCTS_PER_PAGE = 6;
type AccumulatorType = (Product & { quantity: number })[];

const CartPage: React.FC = () => {
    const isAuth = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

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

    const handleAddProduct = async (id: string) => {
        try {
            await authAxios.patch(`/lists/cart/add/${id}`);
            const res = await authAxios.get('/lists/cart/products');
            setProducts(res.data);
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

    const handleRemoveProduct = async (id: string) => {
        try {
            await authAxios.patch(`/lists/cart/remove/${id}`);

            setProducts((prev) => {
                const index = prev.findIndex((product) => product._id === id);
                prev.splice(index, 1);
                return [...prev];
            });
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

    const handlePageChange = (page: number) => {
        setPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div id='CartPage'>
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
                        <div className='w-full flex -lg:hidden'>
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
                                        <h3 className='relative left-1/2 -translate-x-1/2 pt-[20vh] text-center font-bold text-2xl'>No products found</h3>
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
                            <TotalPrice products={products} />
                        </div>
                        {/* MOBILE */}
                        <div className='w-full flex lg:hidden'>
                            <div className='w-full px-2 mt-4 pt-4 border-t-2'>
                                {products.length === 0 ? (
                                    <h3 className='text-center font-bold text-2xl'>No products found</h3>
                                ) : (
                                    <div className='flex items-center flex-col gap-6'>
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
            <TotalPriceMobile products={products} />
            <Footer />
        </div>
    );
};

export default CartPage;
