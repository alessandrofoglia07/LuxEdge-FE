import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { HomeIcon, CubeIcon, BanknotesIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Highlight from '@/components/Highlight';
import Benefit from '@/components/Benefit';
import axios, { isAxiosError } from 'axios';
import ProductCard from '@/components/ProductCard';
import Testimonial from '@/components/Testimonial';
import Img from '@/components/CustomElements/CustomImg';
import Footer from '@/components/Footer';
import LuxEdge from '@/components/LuxEdgeLogo';
import { motion } from 'framer-motion';
import { Product, Testimonial as TestimonialT } from '@/types';
import useWindowWidth from '@/hooks/useWindowWidth';
import useAuth from '@/hooks/useAuth';
import getFavsList from '@/utils/getFavsList';
import Spinner from '@/components/Spinner';
import Favorites from '@/redux/persist/Favorites';
import NotificationsMenu from '@/components/NotificationsMenu';
import homePageBed from '@/static/homepageBed.jpg';
import homePageDesk from '@/static/homepageDesk.jpg';
import testimonial1 from '@/static/testimonials/testimonial1.jpg';
import testimonial2 from '@/static/testimonials/testimonial2.jpg';
import testimonial3 from '@/static/testimonials/testimonial3.jpg';

const CustomLi = ({ children }: { children: React.ReactNode }) => (
    <li className='-md:text-md text-2xl font-bold'>
        <span className='text-2xl text-primary-base'>•</span> {children}
    </li>
);

const benefits = [
    {
        Icon: HomeIcon,
        title: 'Comfort',
        subtitle: 'Our furniture is designed to be comfortable and ergonomic.'
    },
    {
        Icon: CubeIcon,
        title: 'Luxury',
        subtitle: 'Our designs are defined by experts modern and luxorious.'
    },
    {
        Icon: BanknotesIcon,
        title: 'Low-price',
        subtitle: 'Our furniture is affordable and high quality.'
    }
];

const mockTestimonials: TestimonialT[] = [
    {
        pfpPath: testimonial1,
        rating: 4.5,
        author: 'John Doe',
        text: 'The craftsmanship of the bedroom set is superb, and it has transformed my bedroom into a cozy and stylish oasis.'
    },
    {
        pfpPath: testimonial2,
        rating: 5,
        author: 'Jane Doe',
        text: 'I found the perfect sofa for my living room, and it far exceeded my expectations in terms of quality and comfort. It looks and feels like a luxurious piece, yet it fits well within my budget.'
    },
    {
        pfpPath: testimonial3,
        rating: 4.5,
        author: 'Johnny Doe',
        text: 'The quality of the furniture is top-notch, and the designs are absolutely stunning. The chairs are not only comfortable but also add a touch of elegance to my dining area.'
    }
];

const HomePage: React.FC = () => {
    const url = `${import.meta.env.VITE_API_URL}/api/products/search?sort=recommend&limit=8`;
    const width = useWindowWidth();
    const isAuth = useAuth();

    const [scroll, setScroll] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [favsList, setFavsList] = useState<string[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);

    const handleArrowClick = (direction: 'left' | 'right') => {
        const container = document.getElementById('products-container');
        if (!container) return;

        let scrollAmount = 0;

        if (width < 768) {
            scrollAmount = 400;
        } else {
            scrollAmount = 600;
        }

        if (direction === 'left') {
            container.scrollLeft -= scrollAmount;
        } else {
            container.scrollLeft += scrollAmount;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            const container = document.getElementById('products-container');
            if (!container) return;

            const handleScroll = () => {
                setScroll(container.scrollLeft);
                if (maxScroll === 0) {
                    setMaxScroll(container.scrollWidth - container.clientWidth);
                }
            };

            setScroll(container.scrollLeft);
            setMaxScroll(container.scrollWidth - container.clientWidth);

            container.addEventListener('scroll', handleScroll);

            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }, 100);
    }, [products]);

    useEffect(() => {
        (async () => {
            try {
                setProductsLoading(true);
                const res = await axios.get(url);
                setProducts(res.data.products);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    throw err;
                } else if (typeof err === 'string') {
                    throw new Error(err);
                } else {
                    console.log(err);
                }
            } finally {
                setProductsLoading(false);
            }
        })();
    }, [url]);

    const handleFavorite = (val: boolean, _id: string) => {
        if (val) {
            setFavsList((prev) => [...prev, _id]);
            Favorites.add(_id);
        } else {
            setFavsList((prev) => prev.filter((id) => id !== _id));
            Favorites.remove(_id);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                setProductsLoading(true);

                if (isAuth) {
                    const favsList = (await getFavsList()) || [];
                    setFavsList(favsList);
                } else {
                    const favsList = Favorites.get();
                    setFavsList(favsList);
                }
            } catch (err: unknown) {
                if (isAxiosError(err)) {
                    throw err.response?.data;
                } else if (typeof err === 'string') {
                    throw new Error(err);
                } else {
                    console.log(err);
                }
            } finally {
                setProductsLoading(false);
            }
        })();
    }, [isAuth]);

    return (
        <div id='HomePage'>
            <Navbar />
            <main className='min-h-page pt-16'>
                <section id='hero' className='flex -lg:flex-col-reverse'>
                    <div className='flex flex-col justify-center lg:left-0 lg:ml-16 lg:h-[calc(100vh-4rem)] lg:w-1/2 -lg:w-full -lg:items-center'>
                        <div className='mb-16 lg:absolute lg:px-16 lg:pt-4 -lg:flex -lg:flex-col -lg:items-center -lg:px-2 -lg:text-center homepage-limit:px-16'>
                            <motion.h1
                                initial={{
                                    opacity: 0,
                                    y: -20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.7
                                    }
                                }}
                                viewport={{ once: true }}
                                className='mb-8 text-7xl font-extrabold tracking-tight -md:text-4xl'>
                                Switch from a <Highlight effect>house</Highlight>, <br /> to a <Highlight effect>home</Highlight>.
                            </motion.h1>
                            <motion.h4
                                initial={{
                                    opacity: 0,
                                    y: -10
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.7,
                                        delay: 0.8
                                    }
                                }}
                                viewport={{ once: true }}
                                className='text-4xl font-medium tracking-tighter -md:text-xl'
                                id='hero-subtitle'>
                                <LuxEdge className='font-medium' /> takes care of your{' '}
                                <Highlight effect lighter>
                                    home
                                </Highlight>{' '}
                                <br /> while you take care of your <Highlight effect>life</Highlight>.
                            </motion.h4>
                            <motion.a
                                initial={{ opacity: 0 }}
                                whileInView={{
                                    opacity: 1,
                                    transition: {
                                        duration: 0.7,
                                        delay: 1.2
                                    }
                                }}
                                viewport={{ once: true }}
                                href='products'
                                className='mt-12 inline-block rounded-3xl bg-primary-base px-10 py-3 text-2xl font-bold capitalize text-white transition-all duration-200 hover:rounded-2xl hover:bg-primary-hover'>
                                our products
                            </motion.a>
                            <ul className='ml-1 mt-6 flex flex-col items-start'>
                                {['Comfort.', 'Luxury.', 'Modernity.'].map((item, i) => (
                                    <motion.div
                                        initial={{
                                            opacity: 0
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            transition: {
                                                duration: 0.8,
                                                delay: 2 + i * 0.4
                                            }
                                        }}
                                        viewport={{ once: true }}
                                        key={i}>
                                        <CustomLi>{item}</CustomLi>
                                    </motion.div>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.7,
                                delay: 0.2
                            }
                        }}
                        viewport={{ once: true }}
                        className='flex items-center justify-center lg:relative lg:right-0 lg:h-[calc(100vh-4rem)] lg:w-1/2 -lg:mt-4 -lg:w-full'>
                        <Img src={homePageBed} alt='hero-img' className='mb-16 transition-all lg:h-[50vh] lg:w-[50vw] -lg:h-[50vw] -lg:w-screen homepage-limit:hidden' />
                    </motion.div>
                </section>
                <section id='problem-solution' className='flex border-b-2 border-t-2 border-slate-300 bg-slate-200 py-8 -lg:flex-col'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.7,
                                delay: 0.2
                            }
                        }}
                        viewport={{ once: true }}
                        className='flex items-center justify-center lg:w-1/2 -lg:w-full'>
                        <Img id='hero-img' src={homePageDesk} alt='desk' className='mb-16 lg:h-[70vh] lg:w-[50vw] -lg:h-[70vw] -lg:w-screen' />
                    </motion.div>
                    <div className='flex items-center lg:w-1/2 -lg:w-full'>
                        <div className='mb-16 flex flex-col lg:pr-8 -lg:px-8'>
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.7,
                                        delay: 0.1
                                    }
                                }}
                                viewport={{ once: true }}
                                className='my-12 text-5xl font-extrabold tracking-tight -md:text-3xl'>
                                The problem
                            </motion.h2>
                            <motion.h6
                                initial={{
                                    opacity: 0
                                }}
                                whileInView={{
                                    opacity: 1,
                                    transition: {
                                        duration: 0.7,
                                        delay: 0.4
                                    }
                                }}
                                viewport={{ once: true }}
                                className='mb-6 text-2xl font-medium -md:text-lg'>
                                Today it is nearly impossible to find <Highlight>modern</Highlight> and <Highlight>luxurious</Highlight> furniture that is also{' '}
                                <Highlight>affordable</Highlight> and <Highlight>comfortable</Highlight>.
                            </motion.h6>
                            <motion.p
                                initial={{
                                    opacity: 0
                                }}
                                whileInView={{
                                    opacity: 1,
                                    transition: {
                                        duration: 0.7,
                                        delay: 0.8
                                    }
                                }}
                                viewport={{ once: true }}
                                className='mb-6 text-2xl font-medium -md:text-lg'>
                                How much time have you searched the internet for the perfect piece of furniture for the space you spend <Highlight lighter>most of your time</Highlight>{' '}
                                in?
                            </motion.p>
                            <motion.p
                                initial={{
                                    opacity: 0
                                }}
                                whileInView={{
                                    opacity: 1,
                                    transition: {
                                        duration: 0.7,
                                        delay: 1.2
                                    }
                                }}
                                viewport={{ once: true }}
                                className='mb-6 text-2xl font-medium -md:text-lg'>
                                How many times have you found the perfect piece of furniture only to find out that it is <Highlight lighter>way out of your budget</Highlight>?
                            </motion.p>
                            <motion.p
                                initial={{
                                    opacity: 0
                                }}
                                whileInView={{
                                    opacity: 1,
                                    transition: {
                                        duration: 0.7,
                                        delay: 1.6
                                    }
                                }}
                                viewport={{ once: true }}
                                className='text-2xl font-medium -md:text-lg'>
                                Now with <LuxEdge className='font-bold' />, that long and frustrating is <Highlight lighter>only a bad memory</Highlight>. We offer the best quality
                                furniture, with both a <Highlight lighter>modern look</Highlight> and the nice old <Highlight lighter>comfort</Highlight> at a{' '}
                                <Highlight lighter>lower price</Highlight>.
                            </motion.p>
                        </div>
                    </div>
                </section>
                <section id='benefits' className='flex w-full flex-col items-center border-b-2 border-slate-300 py-20 lg:py-28'>
                    <motion.h1
                        initial={{
                            opacity: 0,
                            y: -20
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.7
                            }
                        }}
                        viewport={{ once: true }}
                        className='text-5xl font-extrabold tracking-tight -md:text-3xl'>
                        Our Benefits
                    </motion.h1>
                    <div id='benefits-container' className='mt-16 flex w-full justify-evenly -md:mt-4 -md:px-2 -lg:flex-col'>
                        {benefits.map((benefit, i) => (
                            <Benefit key={i} i={i} Icon={benefit.Icon} title={benefit.title} subtitle={benefit.subtitle} />
                        ))}
                    </div>
                </section>
                <section id='suggested-products' className='flex w-full flex-col items-center border-b-2 border-slate-300 bg-slate-200 py-8'>
                    <motion.h1
                        initial={{
                            opacity: 0,
                            y: -20
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.7
                            }
                        }}
                        viewport={{ once: true }}
                        className='py-8 text-5xl font-extrabold tracking-tight lg:px-8 -md:text-3xl'>
                        Our bestseller products
                    </motion.h1>
                    <div id='products-container' className='flex w-full items-center gap-8 overflow-x-scroll scroll-smooth p-4'>
                        {productsLoading ? (
                            <Spinner className='mx-auto my-4' />
                        ) : (
                            <>
                                {scroll > 0 && (
                                    <button onClick={() => handleArrowClick('left')} className='absolute left-5 z-20 rounded-full bg-primary-light p-1.5'>
                                        <ArrowLeftIcon className='h-8 w-8 text-white' />
                                    </button>
                                )}
                                {products.map((product, i) => (
                                    <ProductCard key={i} product={product} isFavorite={favsList.some((id) => id === product._id)} setIsFavorite={handleFavorite} />
                                ))}
                                {Math.round(scroll) < Math.round(maxScroll) && (
                                    <button onClick={() => handleArrowClick('right')} className='absolute right-5 z-20 rounded-full bg-primary-light p-1.5'>
                                        <ArrowRightIcon className='h-8 w-8 text-white' />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
                <section id='testimonials' className='flex flex-col items-center py-10'>
                    <motion.h1
                        initial={{
                            opacity: 0,
                            y: -20
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.7
                            }
                        }}
                        viewport={{ once: true }}
                        className='py-8 text-center text-5xl font-extrabold tracking-tight lg:px-10 -md:text-3xl'>
                        What clients say
                    </motion.h1>
                    <div id='testimonials-container' className='flex w-full lg:justify-evenly -lg:flex-col -lg:items-center -lg:gap-8'>
                        {(width > 768 ? mockTestimonials : mockTestimonials.slice(0, 2)).map((testimonial, i) => (
                            <motion.div
                                initial={{
                                    opacity: 0
                                }}
                                whileInView={{
                                    opacity: 1,
                                    transition: {
                                        delay: i * 0.2,
                                        duration: 0.5
                                    }
                                }}
                                viewport={{ once: true }}
                                key={i}
                                className='flex w-full flex-col items-center'>
                                <Testimonial testimonial={testimonial} />
                            </motion.div>
                        ))}
                    </div>
                </section>
                <section id='final-call-to-action' className='flex flex-col items-center border-b-2 border-slate-300 py-16'>
                    <motion.a
                        initial={{
                            opacity: 0
                        }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.5,
                                delay: 0.5
                            }
                        }}
                        viewport={{ once: true }}
                        href='/products'
                        className='my-4 inline-block rounded-3xl bg-primary-base px-[20vw] py-4 text-4xl font-extrabold capitalize text-white shadow-xl transition-all duration-200 hover:rounded-xl hover:bg-primary-hover md:px-48'>
                        Learn more
                    </motion.a>
                </section>
                <Footer />
            </main>
            <NotificationsMenu />
        </div>
    );
};

export default HomePage;
