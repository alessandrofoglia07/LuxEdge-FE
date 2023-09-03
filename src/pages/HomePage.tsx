import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { HomeIcon, CubeIcon, BanknotesIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Highlight from '@/components/Highlight';
import Benefit from '@/components/Benefit';
// import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import Testimonial from '@/components/Testimonial';
import Img from '@/components/CustomImg';
import Footer from '@/components/Footer';
import LuxEdge from '@/components/LuxEdgeLogo';
import { motion } from 'framer-motion';
import { mockProducts, mockTestimonials } from '@/assets/mock';
import { Product } from '@/types';

const CustomLi = ({ children }: { children: React.ReactNode }) => (
    <li className='font-bold text-xl'>
        <span className='text-white text-2xl'>•</span> {children}
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

const HomePage: React.FC = () => {
    const url = `${import.meta.env.VITE_API_URL}/api/products/suggested`;

    const [scroll, setScroll] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);

    const handleArrowClick = (direction: 'left' | 'right') => {
        const container = document.getElementById('products-container');
        if (!container) return;

        const scrollAmount = 400;

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
            // await axios.get(url);
            // setProducts(res.data);
            setProducts(mockProducts.slice(0, 5));
        })();
    }, [url]);

    return (
        <div id='HomePage'>
            <Navbar />
            <main className='pt-16'>
                <section id='hero' className='flex -lg:flex-col-reverse'>
                    <div className='-lg:w-full lg:w-1/2 lg:left-0 lg:h-[calc(100vh-4rem)] lg:ml-16 flex flex-col justify-center -lg:items-center'>
                        <div className='mb-16 lg:px-16 -lg:px-2 -lg:flex -lg:flex-col -lg:items-center -lg:text-center'>
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
                                className='font-extrabold text-7xl select-none tracking-tighter mb-8'>
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
                                        delay: 1
                                    }
                                }}
                                className='font-bold text-4xl tracking-normal select-none'>
                                <LuxEdge /> takes care of your{' '}
                                <Highlight effect lighter>
                                    home
                                </Highlight>{' '}
                                <br /> so you can take care of your <Highlight effect>life</Highlight>.
                            </motion.h4>
                            <motion.a
                                initial={{ opacity: 0 }}
                                whileInView={{
                                    opacity: 1,
                                    transition: {
                                        duration: 0.7,
                                        delay: 1.5
                                    }
                                }}
                                href='products'
                                className='font-bold inline-block text-2xl capitalize px-10 py-3 rounded-xl text-white bg-primary-base hover:bg-primary-hover mt-12'>
                                our products
                            </motion.a>
                            <ul className='mt-4 ml-1 flex flex-col items-start'>
                                {['Comfort.', 'Luxury.', 'Modernity.'].map((item, i) => (
                                    <motion.div
                                        initial={{
                                            opacity: 0
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            transition: {
                                                duration: 0.8,
                                                delay: 2 + i * 0.8
                                            }
                                        }}
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
                        className='-lg:w-full lg:w-1/2 lg:right-0 -lg:mt-4 lg:relative lg:h-[calc(100vh-4rem)] flex items-center justify-center'>
                        <Img src='/homepageBed.jpg' alt='hero-img' className='mb-16 lg:w-[50vw] -lg:h-[50vw] lg:h-[50vh] -lg:w-screen' />
                    </motion.div>
                </section>
                <section id='problem-solution' className='bg-slate-200 py-8 flex -lg:flex-col'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.7,
                                delay: 0.2
                            }
                        }}
                        className='-lg:w-full lg:w-1/2 flex items-center justify-center'>
                        <Img src='/homepageDesk.jpg' alt='desk' className='mb-16 lg:w-[50vw] -lg:h-[70vw] lg:h-[70vh] -lg:w-screen' />
                    </motion.div>
                    <div className='-lg:w-full lg:w-1/2 flex items-center'>
                        <div className='flex flex-col -lg:px-8 lg:pr-8 mb-16'>
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.7,
                                        delay: 0.8
                                    }
                                }}
                                className='font-extrabold text-5xl tracking-tight my-8'>
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
                                        delay: 1.2
                                    }
                                }}
                                className='text-2xl mb-8 font-semibold'>
                                Today it is nearly impossible to find nice <Highlight>modern</Highlight> furniture that is also <Highlight>affordable</Highlight> and{' '}
                                <Highlight>comfortable</Highlight>.
                            </motion.h6>
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
                                className='text-xl mb-2 font-semibold'>
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
                                        delay: 2
                                    }
                                }}
                                className='text-xl mb-8 font-semibold'>
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
                                        delay: 2.4
                                    }
                                }}
                                className='text-xl font-semibold'>
                                Now with <LuxEdge />, that long and frustrating is <Highlight lighter>only a bad memory</Highlight>. We offer the best quality furniture, with both a{' '}
                                <Highlight lighter>modern look</Highlight> and the nice old <Highlight lighter>comfort</Highlight> at a <Highlight lighter>lower price</Highlight>.
                            </motion.p>
                        </div>
                    </div>
                </section>
                <section id='benefits' className='flex flex-col items-center w-full py-20 lg:py-28'>
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
                        className='font-extrabold text-5xl tracking-tight select-none'>
                        <Highlight>Our Benefits</Highlight>
                    </motion.h1>
                    <div id='benefits-container' className='flex -lg:flex-col justify-evenly w-full mt-16'>
                        {benefits.map((benefit, i) => (
                            <Benefit key={i} i={i} Icon={benefit.Icon} title={benefit.title} subtitle={benefit.subtitle} />
                        ))}
                    </div>
                </section>
                <section id='suggested-products' className='bg-slate-200 flex flex-col w-full py-8 items-center'>
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
                        className='lg:px-8 py-8 font-extrabold text-5xl tracking-tight'>
                        <Highlight>Our bestseller products</Highlight>
                    </motion.h1>
                    <div id='products-container' className='flex gap-8 overflow-x-scroll scroll-smooth items-center w-full p-4'>
                        {scroll > 0 && (
                            <button onClick={() => handleArrowClick('left')} className='bg-primary-light rounded-full p-1.5 absolute left-5 z-50'>
                                <ArrowLeftIcon className='h-8 w-8 text-white' />
                            </button>
                        )}
                        {products.map((product, i) => (
                            <ProductCard key={i} product={product} />
                        ))}
                        {Math.round(scroll) < Math.round(maxScroll) && (
                            <button onClick={() => handleArrowClick('right')} className='bg-primary-light rounded-full p-1.5 absolute right-5 z-50'>
                                <ArrowRightIcon className='h-8 w-8 text-white' />
                            </button>
                        )}
                    </div>
                </section>
                <section id='testimonials' className='py-10 flex flex-col items-center'>
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
                        className='py-8 lg:px-10 font-extrabold text-5xl tracking-tight text-center select-none'>
                        <Highlight>What clients say</Highlight>
                    </motion.h1>
                    <div id='testimonials-container' className='flex -lg:flex-col -lg:items-center -lg:gap-8 lg:justify-evenly w-full'>
                        {mockTestimonials.map((testimonial, i) => (
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
                                key={i}>
                                <Testimonial testimonial={testimonial} />
                            </motion.div>
                        ))}
                    </div>
                </section>
                <section id='final-call-to-action' className='bg-slate-200 flex flex-col items-center py-16'>
                    <h1 className='text-center py-8 text-6xl font-extrabold'>
                        <motion.span
                            initial={{
                                opacity: 0
                            }}
                            whileInView={{
                                opacity: 1,
                                transition: {
                                    duration: 0.7
                                }
                            }}>
                            Time to check{' '}
                        </motion.span>
                        <motion.span
                            initial={{
                                opacity: 0
                            }}
                            whileInView={{
                                opacity: 1,
                                transition: {
                                    duration: 0.7,
                                    delay: 0.5
                                }
                            }}>
                            <Highlight>yourself!</Highlight>
                        </motion.span>
                    </h1>
                    <motion.a
                        initial={{
                            opacity: 0
                        }}
                        whileInView={{
                            opacity: 1,
                            transition: {
                                duration: 0.7,
                                delay: 1
                            }
                        }}
                        href='/products'
                        className='capitalize inline-block py-4 my-4 bg-primary-base hover:bg-primary-hover text-white rounded-lg px-16 font-extrabold text-2xl'>
                        our products
                    </motion.a>
                </section>
                <Footer />
            </main>
        </div>
    );
};

export default HomePage;
