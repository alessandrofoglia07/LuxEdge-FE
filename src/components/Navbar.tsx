import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChevronDownIcon, StarIcon, ShoppingCartIcon } from '@heroicons/react/20/solid';
import useWindowWidth from '@/hooks/useWindowWidth';

const Category = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <a className={`text-black font-bold py-1 ${className}`}>{children}</a>;
};

const HSpacer = () => <hr className='mr-6' />;

const VSpacer = () => <div className='border-r-2 border-r-slate-300 h-1/2' />;

const Navbar: React.FC<any> = () => {
    const width = useWindowWidth();

    return (
        <nav id='Navbar' className='w-full shadow-md flex items-center justify-center z-10 h-16 bg-slate-100 fixed'>
            <div id='left'>
                <div id='logo' className='flex items-center justify-self-start'>
                    <h1 className='md:px-10 px-7 text-4xl font-extrabold tracking-tight cursor-pointer'>
                        Lux<span className='text-blue-500 hover:text-blue-600'>Edge</span>
                    </h1>
                </div>
            </div>
            <div id='center' className='w-full h-full mx-20'>
                <ul id='navlinks' className='self-center items-center justify-self-center flex justify-evenly w-full h-full'>
                    <li className='flex items-center pl-16 my-3 pr-4'>
                        <a href='/' className='font-bold text-xl'>
                            Home
                        </a>
                    </li>
                    <VSpacer />
                    <li className='flex items-center my-3 px-4'>
                        <a href='/products' className='font-bold text-xl'>
                            Products
                        </a>
                    </li>
                    <VSpacer />
                    <li>
                        <Popover className='relative'>
                            {({ open }) => (
                                <>
                                    <Popover.Button
                                        className={`font-bold text-xl flex items-center my-2 py-1 px-4 focus-visible:outline-none ${
                                            open ? 'bg-blue-200 text-blue-600 rounded-xl' : ''
                                        }`}>
                                        Categories <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} w-8 ml-2`} />
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter='transition ease-out duration-200'
                                        enterFrom='opacity-0 translate-y-0'
                                        enterTo='opacity-100 translate-y-1'
                                        leave='transition ease-in duration-150'
                                        leaveFrom='opacity-100 translate-y-1'
                                        leaveTo='opacity-0 translate-y-0'>
                                        <Popover.Panel className='absolute z-20 ml-10'>
                                            <div className='flex flex-col pl-6 justify-center w-48 h-fit gap-1 bg-white rounded-md shadow-lg border-2 border-slate-500'>
                                                <Category className='pt-4'>Beds</Category>
                                                <HSpacer />
                                                <Category>Bookshelves</Category>
                                                <HSpacer />
                                                <Category>Chairs</Category>
                                                <HSpacer />
                                                <Category>Desks</Category>
                                                <HSpacer />
                                                <Category>Drawers</Category>
                                                <HSpacer />
                                                <Category>Sofas</Category>
                                                <HSpacer />
                                                <Category>Tables</Category>
                                                <HSpacer />
                                                <Category>Bedrooms</Category>
                                                <HSpacer />
                                                <Category className='pb-4'>Living rooms</Category>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </li>
                    <VSpacer />
                    <li className='flex items-center my-3 px-4'>
                        <a href='/contact' className='font-bold text-xl'>
                            Contact us
                        </a>
                    </li>
                </ul>
            </div>
            <div id='right' className='flex items-center'>
                <a id='Login' href='/login' className='font-bold text-lg mx-4'>
                    Login
                </a>
                <a id='Register' href='register' className='font-bold text-lg px-4 py-2 rounded-xl text-white bg-blue-500 hover:bg-blue-600 mx-4'>
                    Register
                </a>
                {/*
                    <a id='Favorites' className='font-bold text-lg px-4 py-2 rounded-xl text-white bg-blue-500 hover:bg-blue-600 flex items-center gap-2'>
                        Favorites <StarIcon className='w-6 text-yellow-300' />
                    </a>
                    <a id='Cart' className='font-bold text-lg px-4 py-2 rounded-xl text-white bg-blue-500 hover:bg-blue-600 flex items-center gap-2'>
                        Cart <ShoppingCartIcon className='w-6' />
                    </a>
                */}
            </div>
        </nav>
    );
};

export default Navbar;
