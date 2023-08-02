import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { HomeIcon, CubeIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import Highlight from '@/components/Highlight';
import Benefit from '@/components/Benefit';
import axios from 'axios';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

const CustomLi = ({ children }: { children: React.ReactNode }) => (
    <li className='font-bold text-xl'>
        <span className='text-primary-base text-2xl'>•</span> {children}
    </li>
);

const LuxEdge = () => (
    <span className='tracking-tighter font-extrabold'>
        Lux<Highlight>Edge</Highlight>
    </span>
);

const mockProducts: Product[] = [
    {
        _id: '1',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair1.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.8,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '2',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair2.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 3.8,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: '3',
        name: 'Chair',
        description: 'A nice chair',
        price: 100,
        imagePath: 'chairs/chair3.jpg',
        tags: ['chair'],
        sold: 100,
        available: true,
        reviews: [],
        score: 4.6,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const HomePage: React.FC<any> = () => {
    const url = `${import.meta.env.VITE_API_URL}/api/products/suggested`;

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        (async () => {
            await axios.get(url);
            // setProducts(res.data);
            setProducts(mockProducts);
        })();
    }, [url]);

    return (
        <div id='HomePage'>
            <Navbar />
            <main className='pt-16'>
                <section id='hero' className='flex -lg:flex-col-reverse'>
                    <div className='-lg:w-full lg:w-1/2 lg:left-0 lg:h-[calc(100vh-4rem)] lg:ml-16 flex flex-col justify-center -lg:items-center'>
                        <div className='mb-16 lg:px-16 -lg:px-2 -lg:flex -lg:flex-col -lg:items-center -lg:text-center'>
                            <h1 className='font-extrabold text-7xl select-none tracking-tighter mb-8'>
                                Switch from a <Highlight>house</Highlight>, <br /> to a <Highlight>home</Highlight>.
                            </h1>
                            <h4 className='font-bold text-4xl tracking-normal select-none'>
                                <LuxEdge /> takes care of your <Highlight lighter>home</Highlight> <br /> so you can take care of your <Highlight>life</Highlight>.
                            </h4>
                            <button className='font-bold text-2xl capitalize px-10 py-3 rounded-xl text-white bg-primary-base hover:bg-primary-hover mt-12'>our products</button>
                            <ul className='mt-4 ml-1 flex flex-col items-start'>
                                <CustomLi>Comfort.</CustomLi>
                                <CustomLi>Luxury.</CustomLi>
                                <CustomLi>Modernity.</CustomLi>
                            </ul>
                        </div>
                    </div>
                    <div className='-lg:w-full lg:w-1/2 lg:right-0 -lg:mt-4 lg:absolute lg:h-[calc(100vh-4rem)] flex items-center justify-center'>
                        <img src='/homepageBed.jpg' alt='hero img' className='mb-16 lg:w-[50vw] -lg:h-[50vw] lg:h-[50vh] -lg:w-screen object-cover' draggable='false' />
                    </div>
                </section>
                <section id='problem-solution' className='bg-slate-200 py-8 flex -lg:flex-col'>
                    <div className='-lg:w-full lg:w-1/2 flex items-center justify-center'>
                        <img src='/homepageDesk.jpg' alt='desk' className='mb-16 lg:w-[50vw] -lg:h-[70vw] lg:h-[70vh] -lg:w-screen object-cover' draggable='false' />
                    </div>
                    <div className='-lg:w-full lg:w-1/2 flex items-center'>
                        <div className='flex flex-col -lg:px-8 mb-16'>
                            <h2 className='font-extrabold text-5xl tracking-tight my-8'>The problem</h2>
                            <h6 className='text-2xl mb-8 font-semibold'>
                                Today it is nearly impossible to find nice <Highlight>modern</Highlight> furniture that is also <Highlight>affordable</Highlight> and{' '}
                                <Highlight>comfortable</Highlight>.
                            </h6>
                            <p className='text-xl mb-2 font-semibold'>
                                How much time have you searched the internet for the perfect piece of furniture for the space you spend <Highlight lighter>most of your time</Highlight>{' '}
                                in?
                            </p>
                            <p className='text-xl mb-8 font-semibold'>
                                How many times have you found the perfect piece of furniture only to find out that it is <Highlight lighter>way out of your budget</Highlight>?
                            </p>
                            <p className='text-xl font-semibold'>
                                Now with <LuxEdge />, that long and frustrating is <Highlight lighter>only a bad memory</Highlight>. We offer the best quality furniture, with both a{' '}
                                <Highlight lighter>modern look</Highlight> and the nice old <Highlight lighter>comfort</Highlight> at a <Highlight lighter>lower price</Highlight>.
                            </p>
                        </div>
                    </div>
                </section>
                <section id='benefits' className='flex flex-col items-center w-full py-20'>
                    <h1 className='font-extrabold text-5xl tracking-tight select-none'>
                        <Highlight>Our Benefits</Highlight>
                    </h1>
                    <div id='benefits-container' className='flex -lg:flex-col justify-evenly w-full mt-16'>
                        <Benefit Icon={HomeIcon} title='Comfort' subtitle='Our furniture is designed to be comfortable and ergonomic.' />
                        <Benefit Icon={CubeIcon} title='Luxury' subtitle='Our designs are defined by experts modern and luxorious.' />
                        <Benefit Icon={BanknotesIcon} title='Low-price' subtitle='Our furniture is affordable and high quality.' />
                    </div>
                </section>
                <section id='suggested-products' className='bg-slate-200 p-4 flex gap-8'>
                    <ProductCard product={products[0]} />
                    <ProductCard product={products[1]} />
                    <ProductCard product={products[2]} />
                </section>
                <section id='testimonials'></section>
                <section id='end'></section>
            </main>
        </div>
    );
};

export default HomePage;
