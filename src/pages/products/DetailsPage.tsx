import React, { useState, useEffect, Fragment } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@/api/axios';
import { Product, Review as ReviewT } from '@/types';
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
import Review from '@/components/Review';
import RatingButton from '@/components/RatingButton';
import { motion } from 'framer-motion';
import useSelector from '@/hooks/useSelector';
import { Dialog, Transition } from '@headlessui/react';
import NotificationsMenu from '@/components/NotificationsMenu';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/slices/notificationSlice';
import useErrHandler from '@/hooks/useErrHandler';

const DetailsPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useAuth();
    const handleErr = useErrHandler();
    const productName = useParams<{ productName: string }>().productName;
    const productCategory = toSingular(useParams<{ productCategory: string }>().productCategory || '');
    const { userInfo } = useSelector((state) => state.auth);

    const [product, setProduct] = useState<Product | null>(null);
    const [favorite, setFavorite] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
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
            handleErr(err);
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
            const notification = {
                title: 'Product added to cart.',
                content: `${product.name} has been successfully added to your cart.`
            };
            dispatch(addNotification(notification));
        } catch (err: unknown) {
            handleErr(err);
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
            handleErr(err);
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
            const notification = {
                title: 'Review added.',
                content: `Your review has been successfully added.`
            };
            dispatch(addNotification(notification));
        } catch (err: unknown) {
            handleErr(err);
        }
    };

    const handleEditReview = async (text: string, rating: number) => {
        if (!ownReview) return;
        if (!product) return;
        try {
            await authAxios.patch(`/reviews/edit/${ownReview._id}`, { comment: text, rating: rating + 1 });
            await fetchReviews();
            const notification = {
                title: 'Review edited.',
                content: `Your review has been successfully edited.`
            };
            dispatch(addNotification(notification));
        } catch (err: unknown) {
            handleErr(err);
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
            const notification = {
                title: 'Review deleted.',
                content: `Your review has been successfully deleted.`
            };
            dispatch(addNotification(notification));
        } catch (err: unknown) {
            handleErr(err);
        }
    };

    return (
        <div id='DetailsPage'>
            <Navbar />
            <main className='w-[calc(100vw - 9px)] mx-auto flex min-h-page flex-col pt-16'>
                <h4 className='text-md px-4 py-8 font-medium tracking-tight md:px-12 md:text-lg [&>a]:text-gray-600 [&>span]:select-none [&>span]:text-gray-400'>
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
                        <div className='relative left-1/2 mt-8 flex h-max w-full -translate-x-1/2 justify-center gap-8 px-4 lg:w-fit lg:gap-16 lg:px-8 -md:flex-col'>
                            <Img
                                src={toUrl(product.imagePath)}
                                alt={product.name}
                                className='aspect-square h-full w-full max-w-xl self-center rounded-md sm:h-1/2 sm:w-1/2 md:h-1/3 md:w-1/3'
                            />
                            <div className='h-full w-full items-center pb-32 md:w-1/2 md:py-16 -md:flex -md:flex-col -md:px-8'>
                                <h1 className='mb-8 h-fit text-5xl font-extrabold tracking-tight -md:text-center'>{product.name}</h1>
                                <h4 className='h-fit text-xl tracking-wide -md:text-center'>{product.description}</h4>
                                {product.rating > 0 && <Rating rating={product.rating} />}
                                <div className='mt-16 flex items-center justify-between -md:flex-col'>
                                    <div className='flex items-center'>
                                        <button
                                            className='mr-2 flex items-center gap-4 whitespace-nowrap rounded-md bg-primary-base px-6 py-4 text-xl tracking-tight text-white transition-all hover:bg-primary-hover hover:shadow-xl'
                                            onClick={handleAddToCart}>
                                            <ShoppingCartIcon className='h-8 w-8' />
                                            Add to Cart
                                        </button>
                                        <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            className='group mr-2 rounded-md border-2 bg-white p-3 text-gray-700 transition-colors hover:bg-slate-100 hover:text-primary-hover'
                                            onClick={handleAddToFavs}>
                                            <HeartIcon className={`h-10 w-10 transition-colors ${favorite && 'text-red-500 group-hover:text-red-600'}`} />
                                        </motion.button>
                                    </div>
                                    <h3 className='whitespace-nowrap text-3xl font-extrabold tracking-wide text-gray-700 -md:mt-8'>{toPrice(product.price)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className='relative left-1/2 mt-8 flex h-max w-full -translate-x-1/2 flex-col justify-center gap-8 px-4 pb-32 lg:w-1/2 lg:gap-8 lg:px-8 -md:flex-col'>
                            <div className='flex w-full items-center justify-between lg:mb-4 lg:mt-8'>
                                <h2 className='text-3xl font-extrabold tracking-tight'>Product Reviews</h2>
                            </div>
                            {ownReview ? (
                                <Review review={ownReview} key={ownReview._id} modifiable onConfirm={handleEditReview} onDelete={handleDeleteReview} />
                            ) : (
                                <div id='review-editor'>
                                    <textarea
                                        className='focus:elevate mb-6 mt-8 h-40 w-full resize-none rounded-xl border-2 border-slate-100 bg-slate-100 p-4 outline-none transition-all focus:outline-none'
                                        placeholder='Write your review here...'
                                        value={newReview?.text}
                                        onChange={(e) => setNewReview({ text: e.target.value, rating: newReview?.rating || 0 })}
                                    />
                                    <div className='flex items-center justify-between'>
                                        <RatingButton init={newReview?.rating || 4} onChange={(rating) => setNewReview({ text: newReview?.text || '', rating: rating })} />
                                        <button
                                            onClick={handleAddReview}
                                            className='h-12 rounded-lg bg-primary-base px-4 font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-xl'>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}
                            {reviews.length === 0 && <h3 className='mt-8 text-2xl font-medium tracking-tight text-gray-800'>No reviews on this product yet.</h3>}
                            {reviews.map((review) => (
                                <Review review={review} key={review._id} />
                            ))}
                        </div>
                    </>
                ) : null}
            </main>
            <Footer />
            <NotificationsMenu />
            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog as='div' className='relative z-50' onClose={() => setModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'>
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
                                leaveTo='opacity-0 scale-95'>
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
                                            onClick={handleConfirmDeletion}>
                                            Delete it
                                        </button>
                                        <button
                                            type='button'
                                            className='ml-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                                            onClick={() => setModalOpen(false)}>
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
