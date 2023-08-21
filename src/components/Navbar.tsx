import React, { Fragment, useState, useEffect } from 'react';
import { Popover, Transition, Dialog, Disclosure } from '@headlessui/react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import useWindowWidth from '@/hooks/useWindowWidth';
import useRedux from '@/hooks/useRedux';
import categories from '@/assets/productCategories';

interface CategoryProps {
    children: string;
    className?: string;
}

const Category: React.FC<CategoryProps> = ({ children, className }: CategoryProps) => {
    return (
        <a href={`/products?tags=${children.toLowerCase()}`} className={`text-black font-bold py-1 ${className}`}>
            {children}
        </a>
    );
};

const MobileCategory: React.FC<CategoryProps> = ({ children, className }: CategoryProps) => {
    return (
        <a href={`/products?tags=${children.toLowerCase()}`} className={`text-black text-lg font-bold py-1 ${className}`}>
            {children}
        </a>
    );
};

const HSpacer = () => <hr className='mr-6' />;

const VSpacer = () => <div className='border-r-2 border-r-slate-300 h-1/2' />;

const Navbar: React.FC = () => {
    const width = useWindowWidth();

    const { accessToken, userInfo } = useRedux('auth');

    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(true);

    useEffect(() => {
        if (userInfo && accessToken) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [userInfo, accessToken]);

    // xl: >1280px => desktop
    // lg: >1024px => desktop
    // 932px => change to mobile
    // sm: >640px => mobile

    return (
        <header>
            <nav id='Navbar' className='w-full shadow-md flex items-center justify-between z-10 h-16 bg-white fixed'>
                <div id='left'>
                    <div id='logo' className='flex items-center justify-self-start'>
                        <h1 className='sm:px-10 px-7 text-4xl font-extrabold tracking-tight cursor-pointer'>
                            Lux<span className='text-primary-base hover:text-primary-hover'>Edge</span>
                        </h1>
                    </div>
                </div>
                <div id='center' className={`w-full h-full lg:mx-[0] xl:mx-[12%] ${width > 932 ? '' : 'hidden'}`}>
                    <ul id='navlinks' className='self-center items-center justify-self-center flex justify-evenly w-full h-full'>
                        <li className='flex items-center pr-4 sm-pl-0 lg:pl-16 my-3'>
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
                                                open ? 'bg-blue-200 text-primary-hover rounded-xl' : ''
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
                                            <Popover.Panel className='absolute z-20'>
                                                <div className='flex flex-col pl-6 justify-center w-48 h-fit gap-1 bg-white rounded-md shadow-lg border-2 border-slate-500 py-4'>
                                                    {categories.map((category, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <Category>{category}</Category>
                                                                {i !== categories.length - 1 && <HSpacer />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </>
                                )}
                            </Popover>
                        </li>
                        <VSpacer />
                        <li className='flex items-center my-3 px-4'>
                            <a href='/contact' className='font-bold text-xl w-max'>
                                Contact us
                            </a>
                        </li>
                    </ul>
                </div>
                <div id='right' className={`flex items-center ${width > 932 ? '' : 'hidden'}`}>
                    {loggedIn ? (
                        <>
                            <a id='Favorites' href='/favorites' className='font-bold text-lg lg:mx-4 sm:mx-2 flex items-center gap-1'>
                                Favorites <StarIcon className='w-6 mb-1' />
                            </a>
                            <a
                                id='Cart'
                                href='/cart'
                                className='font-bold text-lg px-4 py-2 rounded-xl text-white bg-primary-base hover:bg-primarytext-primary-hover flex items-center gap-2 mr-4'>
                                Cart <ShoppingCartIcon className='w-[1.3rem]' />
                            </a>
                        </>
                    ) : (
                        <>
                            <a id='Login' href='/login' className='font-bold text-lg lg:mx-4 sm:mx-2'>
                                Login
                            </a>
                            <a id='Register' href='/register' className='font-bold text-lg px-4 py-2 rounded-xl text-white bg-primary-base hover:bg-primarytext-primary-hover mx-4'>
                                Register
                            </a>
                        </>
                    )}
                </div>
                <div id='mobile-btn' className={`flex ${width > 932 ? 'hidden' : ''} mx-12 inline-flex items-center justify-center rounded-md text-gray-700`}>
                    <button onClick={() => setMobileMenuOpen(true)}>
                        <span className='sr-only'>Open main menu</span>
                        <Bars3Icon className='h-6 w-6' />
                    </button>
                </div>
            </nav>
            <Dialog as='div' open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
                <div className='fixed inset-0 z-10' />
                <Dialog.Panel className='fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-slate-100 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
                    <Dialog.Title className='flex justify-between'>
                        <a href='/' className='w-fit h-fit'>
                            <img src='/favicon.ico' className='w-12 h-12' />
                        </a>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <span className='sr-only'>Close Menu</span>
                            <XMarkIcon className='w-8' />
                        </button>
                    </Dialog.Title>
                    <div id='content' className='flow-root mt-8'>
                        <ul id='navlinks' className='self-center items-start flex flex-col w-full h-full gap-4'>
                            <li className='flex items-center px-1'>
                                <a href='/' className='font-bold text-xl'>
                                    Home
                                </a>
                            </li>
                            <li className='flex items-center px-1'>
                                <a href='/products' className='font-bold text-xl'>
                                    Products
                                </a>
                            </li>
                            <Disclosure as='div'>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button
                                            className={`font-bold text-xl flex items-center py-1 px-4 -mx-3 focus-visible:outline-none ${
                                                open ? 'bg-blue-200 text-primary-hover rounded-xl' : ''
                                            }`}>
                                            Categories
                                            <ChevronDownIcon className={`${open ? 'rotate-180' : ''} 'h-6 w-6 flex-none'`} aria-hidden='true' />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className='mt-2'>
                                            {categories.map((category, i) => {
                                                return (
                                                    <div key={i} className='px-4 py-[0.2rem]'>
                                                        <MobileCategory>{category}</MobileCategory>
                                                        {i !== categories.length - 1 && <HSpacer />}
                                                    </div>
                                                );
                                            })}
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                            <li className='flex items-center px-1'>
                                <a href='/contact' className='font-bold text-xl'>
                                    Contact us
                                </a>
                            </li>
                        </ul>
                        <ul id='account' className='self-center items-start flex flex-col w-full h-full gap-4 mt-12'>
                            {loggedIn ? (
                                <>
                                    <a id='Favorites' href='/favorites' className='ml-1 font-bold text-lg lg:mx-4 sm:mx-2 flex items-center gap-1'>
                                        Favorites <StarIcon className='w-6 mb-1' />
                                    </a>
                                    <a
                                        id='Cart'
                                        href='/cart'
                                        className='font-bold text-lg px-4 py-2 rounded-xl text-white bg-primary-base hover:bg-primarytext-primary-hover flex items-center gap-2 mr-4'>
                                        Cart <ShoppingCartIcon className='w-[1.3rem]' />
                                    </a>
                                </>
                            ) : (
                                <>
                                    <li className='flex items-center px-1 ml-1'>
                                        <a href='/login' className='font-bold text-xl'>
                                            Login
                                        </a>
                                    </li>
                                    <li className='flex items-center px-1'>
                                        <a
                                            id='Register'
                                            href='/register'
                                            className='font-bold text-lg px-4 py-2 rounded-xl text-white bg-primary-base hover:bg-primarytext-primary-hover'>
                                            Register
                                        </a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
};

export default Navbar;
