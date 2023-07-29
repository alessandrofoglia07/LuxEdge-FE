import React from 'react';
import Navbar from '@/components/Navbar';

const Highlight = ({ children, lighter = false }: { children: React.ReactNode; lighter?: boolean }) => (
    <span className={`${lighter ? 'text-blue-400 hover:text-blue-500' : 'text-blue-500 hover:text-blue-600'}`}>{children}</span>
);

const CustomLi = ({ children }: { children: React.ReactNode }) => (
    <li className='font-bold text-xl'>
        <span className='text-blue-500 text-2xl'>•</span> {children}
    </li>
);

const LuxEdge = () => (
    <span className='tracking-tighter font-extrabold'>
        Lux<Highlight>Edge</Highlight>
    </span>
);

const HomePage: React.FC<any> = () => {
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
                                <LuxEdge /> takes care of your <Highlight lighter>home</Highlight> <br /> so you can take care of your <Highlight lighter>life</Highlight>.
                            </h4>
                            <button className='font-bold text-2xl capitalize px-10 py-3 rounded-xl text-white bg-blue-500 hover:bg-blue-600 mt-12'>our products</button>
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
                <section id='benefits'></section>
                <section id='suggested-products'></section>
                <section id='testimonials'></section>
                <section id='end'></section>
            </main>
        </div>
    );
};

export default HomePage;
