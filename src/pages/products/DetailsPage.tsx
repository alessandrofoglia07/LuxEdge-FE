import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NotificationMessage, Product } from '@/types';
import { toPlural, toSingular } from '@/utils/singularPlural';
import toUrl from '@/utils/toUrl';
import Img from '@/components/CustomElements/CustomImg';
import toPrice from '@/utils/toPrice';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/solid';
import Rating from '@/components/Rating';
import getFavsList from '@/utils/getFavsList';
import useAuth from '@/hooks/useAuth';
import authAxios from '@/api/authAxios';
import Favorites from '@/redux/persist/Favorites';
import Notification from '@/components/Notification';
import Review from '@/components/Review';

interface Notification {
    message: NotificationMessage;
    open: boolean;
    type: 'success' | 'error';
}

const DetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const isAuth = useAuth();
    const productName = useParams<{ productName: string }>().productName;
    const productCategory = toSingular(useParams<{ productCategory: string }>().productCategory || '');

    const [product, setProduct] = useState<Product | null>(null);
    const [favorite, setFavorite] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [notification, setNotification] = useState<Notification | undefined>(undefined);

    useEffect(() => {
        try {
            setLoading(true);

            (async () => {
                const products = (await axios.get(`${import.meta.env.VITE_API_URL}/api/products/details/name/${productName}`)).data;
                let favs: string[] = [];
                if (isAuth) {
                    favs = (await getFavsList()) || [];
                } else {
                    favs = Favorites.get() || [];
                }
                if (products.category !== productCategory) throw new Error('Product not found');
                setProduct(products);
                setFavorite(favs.includes(products._id));
            })();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data);
            } else {
                console.log(err);
            }
        } finally {
            setLoading(false);
        }
    }, [productName]);

    const handleAddToCart = async () => {
        if (!product) return;
        if (!isAuth) {
            navigate('/login');
        }
        try {
            await authAxios.patch(`/lists/cart/add/${product._id}`);
            setNotification({
                message: {
                    title: 'Product added to cart.',
                    content: `${product.name} has been successfully added to your cart!`
                },
                open: true,
                type: 'success'
            });
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data);
            } else {
                console.log(err);
            }
        }
    };

    const handleAddToFavs = async () => {
        if (!product) return;
        try {
            if (favorite) {
                if (isAuth) {
                    // save to db
                    await authAxios.patch(`/lists/favorites/remove/${product._id}`);
                }
                // save locally
                Favorites.remove(product._id);
            } else {
                if (isAuth) {
                    // save to db
                    await authAxios.patch(`/lists/favorites/add/${product._id}`);
                }
                // save locally
                Favorites.add(product._id);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data);
            } else {
                console.log(err);
            }
        } finally {
            setFavorite(!favorite);
        }
    };

    return (
        <div id='DetailsPage'>
            <Navbar />
            <main className='pt-16 mx-auto w-[calc(100vw - 9px)] flex flex-col min-h-page'>
                <h4 className='py-8 md:px-12 px-4 md:text-lg text-md font-semibold [&>a]:text-gray-700 [&>span]:text-gray-400 [&>span]:select-none'>
                    <a href='/products'>Products</a> <span className='px-2'>/</span>{' '}
                    <a href={`/products?tags=${toPlural(productCategory) === 'Living rooms' ? 'livingrooms' : toPlural(productCategory).toLowerCase()}`} className='capitalize'>
                        {toPlural(productCategory!)}
                    </a>{' '}
                    <span className='px-2'>/</span>
                    <a className='capitalize' href={`/products/${toPlural(productCategory)}/${productName}`}>
                        {productName}
                    </a>
                </h4>
                {/* TODO: add reviews */}
                {product && !loading ? (
                    <>
                        <div className='lg:w-fit w-full relative left-1/2 -translate-x-1/2 flex -md:flex-col lg:gap-16 gap-8 justify-center lg:px-8 px-4 mt-8 h-max'>
                            <Img
                                src={toUrl(product.imagePath)}
                                alt={product.name}
                                className='max-w-xl md:w-1/3 md:h-1/3 sm:w-1/2 sm:h-1/2 w-full h-full self-center aspect-square rounded-md'
                            />
                            <div className='md:w-1/2 w-full -md:px-8 h-full md:py-16 pb-32 -md:flex -md:flex-col items-center'>
                                <h1 className='font-extrabold text-5xl mb-8 h-fit -md:text-center tracking-tight'>{product.name}</h1>
                                <h4 className='text-xl h-fit -md:text-center tracking-wide'>{product.description}</h4>
                                {product.rating > 0 && <Rating rating={product.rating} />}
                                <div className='flex items-center -md:flex-col justify-between mt-16'>
                                    <div className='flex items-center'>
                                        <button
                                            className='text-xl flex items-center gap-4 text-white bg-primary-base hover:bg-primary-hover transition-all py-4 px-6 rounded-md mr-2 whitespace-nowrap tracking-tight hover:shadow-xl'
                                            onClick={handleAddToCart}
                                        >
                                            <ShoppingCartIcon className='w-8 h-8' />
                                            Add to Cart
                                        </button>
                                        <button
                                            className='bg-white text-primary-base hover:text-primary-hover border-2 hover:bg-slate-100 transition-colors p-3 rounded-md mr-2 group'
                                            onClick={handleAddToFavs}
                                        >
                                            <HeartIcon className={`w-10 h-10 transition-colors ${favorite && 'text-red-500 group-hover:text-red-600'}`} />
                                        </button>
                                    </div>
                                    <h3 className='text-3xl font-extrabold text-primary-base whitespace-nowrap -md:mt-8 tracking-wide'>{toPrice(product.price)}</h3>
                                </div>
                            </div>
                        </div>
                        {product.reviews.length > 0 && (
                            <div className='lg:w-fit w-full relative left-1/2 -translate-x-1/2 flex -md:flex-col lg:gap-16 gap-8 justify-center lg:px-8 px-4 mt-8 h-max'>
                                {product.reviews.map((review) => (
                                    <Review review={review} key={review._id} />
                                ))}
                            </div>
                        )}
                    </>
                ) : null}
            </main>
            <Footer />
            <Notification
                message={notification?.message || { title: '', content: '' }}
                onClose={() => setNotification(undefined)}
                open={!!notification?.open}
                severity={notification?.type}
            />
        </div>
    );
};

export default DetailsPage;
