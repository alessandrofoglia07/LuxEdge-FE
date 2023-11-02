import React, { useState, useEffect, Fragment } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@/api/axios';
import { isAxiosError } from 'axios';
import { NotificationMessage, Product, Review as ReviewT } from '@/types';
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
import RatingButton from '@/components/RatingButton';
import { motion } from 'framer-motion';
import useSelector from '@/hooks/useSelector';
import { Dialog, Transition } from '@headlessui/react';

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
    const { userInfo } = useSelector((state) => state.auth);

    const [product, setProduct] = useState<Product | null>(null);
    const [favorite, setFavorite] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [notification, setNotification] = useState<Notification | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState(false);

    const [reviews, setReviews] = useState<ReviewT[]>([]);
    const [ownReview, setOwnReview] = useState<null | ReviewT>(null);
    const [newReview, setNewReview] = useState<null | { text: string; rating: number }>(null);

    const fetchReviews = async (specificProduct?: Product) => {
        if (!product && !specificProduct) return;
        const reviewsFromServer: ReviewT[] = (await axios.get(`/reviews/get-reviews/${(specificProduct || product!)._id}`)).data.reviews;
        // check if user has already reviewed this product
        if (isAuth && reviewsFromServer.some((review) => review.user.username === userInfo?.username)) {
            setOwnReview(reviewsFromServer.find((review) => review.user.username === userInfo?.username) || null);
            reviewsFromServer.splice(
                reviewsFromServer.findIndex((review) => review.user.username === userInfo?.username),
                1
            );
        } else {
            setNewReview({ text: '', rating: 4 });
            setOwnReview(null);
        }
        setReviews(reviewsFromServer);
    };

    useEffect(() => {
        try {
            setLoading(true);

            (async () => {
                const product = (await axios.get(`/products/details/name/${productName}`)).data;
                let favs: string[] = [];
                if (isAuth) {
                    favs = (await getFavsList()) || [];
                } else {
                    favs = Favorites.get() || [];
                }
                if (product.category !== productCategory) throw new Error('Product not found');
                await fetchReviews(product);
                setProduct(product);
                setFavorite(favs.includes(product._id));
            })();
        } catch (err) {
            if (isAxiosError(err)) {
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
                    content: `${product.name} has been successfully added to your cart.`
                },
                open: true,
                type: 'success'
            });
        } catch (err: unknown) {
            if (isAxiosError(err)) {
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
            if (isAxiosError(err)) {
                console.log(err.response?.data);
            } else {
                console.log(err);
            }
        } finally {
            setFavorite(!favorite);
        }
    };

    const handleAddReview = async () => {
        if (!newReview) return;
        if (!product) return;
        const { text, rating } = newReview;
        try {
            await authAxios.post(`/reviews/add/${product._id}`, { comment: text, rating: rating + 1 });
            await fetchReviews();
            setNotification({
                message: {
                    title: 'Review added.',
                    content: `Your review has been successfully added.`
                },
                open: true,
                type: 'success'
            });
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.log(err.response?.data);
            } else {
                console.log(err);
            }
        }
    };

    const handleEditReview = async (text: string, rating: number) => {
        if (!ownReview) return;
        if (!product) return;
        try {
            await authAxios.patch(`/reviews/edit/${ownReview._id}`, { comment: text, rating: rating + 1 });
            await fetchReviews();
            setNotification({
                message: {
                    title: 'Review edited.',
                    content: `Your review has been successfully edited.`
                },
                open: true,
                type: 'success'
            });
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.log(err.response?.data);
            } else {
                console.log(err);
            }
        }
    };

    const handleDeleteReview = async () => {
        if (!ownReview) return;
        if (!product) return;
        setModalOpen(true);
    };

    const handleConfirmDeletion = async () => {
        if (!ownReview) return;
        if (!product) return;
        try {
            await authAxios.delete(`/reviews/delete/${ownReview._id}`);
            await fetchReviews();
            setModalOpen(false);
            setNotification({
                message: {
                    title: 'Review deleted.',
                    content: `Your review has been successfully deleted.`
                },
                open: true,
                type: 'success'
            });
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                console.log(err.response?.data);
            } else {
                console.log(err);
            }
        }
    };

    return (
        <div id='DetailsPage'>
            <Navbar />
            <main className='pt-16 mx-auto w-[calc(100vw - 9px)] flex flex-col min-h-page'>
                <h4 className='py-8 md:px-12 px-4 md:text-lg text-md font-medium tracking-tight [&>a]:text-gray-600 [&>span]:text-gray-400 [&>span]:select-none'>
                    <a href='/products'>Products</a> <span className='px-2'>/</span>{' '}
                    <a href={`/products?tags=${toPlural(productCategory) === 'Living rooms' ? 'livingrooms' : toPlural(productCategory).toLowerCase()}`} className='capitalize'>
                        {toPlural(productCategory)}
                    </a>{' '}
                    <span className='px-2'>/</span>
                    <a className='capitalize' href={`/products/${toPlural(productCategory)}/${productName}`}>
                        {productName}
                    </a>
                </h4>
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
                                        <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            className='bg-white text-gray-700 hover:text-primary-hover border-2 hover:bg-slate-100 transition-colors p-3 rounded-md mr-2 group'
                                            onClick={handleAddToFavs}
                                        >
                                            <HeartIcon className={`w-10 h-10 transition-colors ${favorite && 'text-red-500 group-hover:text-red-600'}`} />
                                        </motion.button>
                                    </div>
                                    <h3 className='text-3xl font-extrabold text-gray-700 whitespace-nowrap -md:mt-8 tracking-wide'>{toPrice(product.price)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className='lg:w-1/2 w-full relative left-1/2 -translate-x-1/2 flex flex-col -md:flex-col lg:gap-8 gap-8 justify-center lg:px-8 px-4 mt-8 h-max pb-32'>
                            <div className='w-full flex justify-between items-center lg:mb-4 lg:mt-8'>
                                <h2 className='text-3xl font-extrabold tracking-tight'>Product Reviews</h2>
                            </div>
                            {ownReview ? (
                                <Review review={ownReview} key={ownReview._id} modifiable onConfirm={handleEditReview} onDelete={handleDeleteReview} />
                            ) : (
                                <div id='review-editor'>
                                    <textarea
                                        className='w-full h-40 bg-slate-100 border-2 border-slate-100 rounded-xl p-4 mt-8 mb-6 resize-none focus:outline-none focus:elevate transition-all outline-none'
                                        placeholder='Write your review here...'
                                        value={newReview?.text}
                                        onChange={(e) => setNewReview({ text: e.target.value, rating: newReview?.rating || 0 })}
                                    />
                                    <div className='flex justify-between items-center'>
                                        <RatingButton init={newReview?.rating || 4} onChange={(rating) => setNewReview({ text: newReview?.text || '', rating: rating })} />
                                        <button
                                            onClick={handleAddReview}
                                            className='px-4 h-12 bg-primary-base hover:bg-primary-hover rounded-lg text-white font-semibold hover:shadow-xl transition-all'
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}
                            {reviews.length === 0 && <h3 className='text-2xl font-medium tracking-tight text-gray-800 mt-8'>No reviews on this product yet.</h3>}
                            {reviews.map((review) => (
                                <Review review={review} key={review._id} />
                            ))}
                        </div>
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
            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog as='div' className='relative z-50' onClose={() => setModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black/25' />
                    </Transition.Child>
                    <div className='fixed inset-0 overflow-y-auto'>
                        <div className='flex min-h-full items-center justify-center p-4 text-center'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                    <Dialog.Title as='h3' className='text-xl font-bold leading-6 text-gray-900'>
                                        Are you sure?
                                    </Dialog.Title>
                                    <div className='mt-2'>
                                        <p className='text-sm text-gray-700'>Your feedback is very important to us. Are you sure you want to delete this review?</p>
                                    </div>
                                    <div className='mt-4'>
                                        <button
                                            type='button'
                                            className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                                            onClick={handleConfirmDeletion}
                                        >
                                            Delete it
                                        </button>
                                        <button
                                            type='button'
                                            className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ml-2'
                                            onClick={() => setModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default DetailsPage;
