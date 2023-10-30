import React, { Fragment, useState, useEffect } from 'react';
import { Popover, Transition, Dialog } from '@headlessui/react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, HeartIcon, ShoppingCartIcon, ArrowRightOnRectangleIcon as LoginIcon } from '@heroicons/react/20/solid';
import { StarIcon } from '@heroicons/react/24/outline';
import useWindowWidth from '@/hooks/useWindowWidth';
import useAuth from '@/hooks/useAuth';
import Button from './CustomElements/StyledButton';
import categories from '@/utils/categories';

interface CategoryProps {
    children: string;
    className?: string;
}

const Category: React.FC<CategoryProps> = ({ children, className }: CategoryProps) => {
    return (
        <a href={`/products?tags=${children === 'Living rooms' ? 'livingrooms' : children.toLowerCase()}`} className={`text-black font-bold py-1 ${className}`}>
            {children}
        </a>
    );
};

const MobileCategory: React.FC<CategoryProps> = ({ children, className }: CategoryProps) => {
    return (
        <a href={`/products?tags=${children === 'Living rooms' ? 'livingrooms' : children.toLowerCase()}`} className={`text-slate-700 text-xl font-semibold ${className}`}>
            {children}
        </a>
    );
};

const HSpacer = () => <hr className='mr-6' />;

const VSpacer = () => <div className='border-r-2 border-r-slate-300 h-1/2' />;

const Navbar: React.FC = () => {
    const width = useWindowWidth();
    const isAuth = useAuth();

    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(true);
    const [time, setTime] = useState<number>(0);
    let lastScroll = 0;

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;

            const classlist = document.getElementById('Navbar')?.classList;

            if (currentScroll > lastScroll) {
                classlist?.add('-translate-y-full');
            } else {
                classlist?.remove('-translate-y-full');
            }

            lastScroll = currentScroll;
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (width > 932) {
            handleClose();
        }
    }, [width]);

    const handleOpen = () => {
        if (Date.now() - time < 100) return;

        setMobileMenuOpen(true);

        setTimeout(() => {
            const panel = document.getElementById('mobile-panel');

            if (panel) {
                panel.classList.remove('-translate-x-full');
            }
        }, 50);

        setTime(Date.now());
    };

    const handleClose = () => {
        if (Date.now() - time < 100) return;

        const panel = document.getElementById('mobile-panel');

        if (panel) {
            panel.classList.add('-translate-x-full');
        }

        setTimeout(() => {
            setMobileMenuOpen(false);
            setTime(Date.now());
        }, 300);
    };

    useEffect(() => {
        if (isAuth) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [isAuth]);

    // xl: >1280px => desktop
    // lg: >1024px => desktop
    // 932px => change to mobile
    // sm: >640px => mobile

    return (
        <header>
            {/* START DESKTOP MENU */}

            <nav id='Navbar' className='transition-all w-full flex bg-white-gradient items-center justify-between h-16 fixed top-0 left-0 z-50'>
                <div id='left'>
                    <div id='logo' className='flex items-center justify-self-start'>
                        <a className='sm:px-10 px-7 h-min py-1 text-4xl font-extrabold tracking-tight cursor-pointer select-none' href='/'>
                            Lux<span className='text-primary-base hover:text-primary-hover'>Edge</span>
                        </a>
                    </div>
                </div>
                <div id='center' className={`w-full h-full lg:mx-[0] xl:mx-[12%] ${width > 932 ? '' : 'hidden'}`}>
                    <ul id='navlinks' className='self-center items-center justify-self-center flex justify-evenly w-full h-full'>
                        <li className='flex items-center pr-4 sm-pl-0 lg:pl-16 my-3'>
                            <a href='/' className='font-bold text-xl select-none'>
                                Home
                            </a>
                        </li>
                        <VSpacer />
                        <li className='flex items-center my-3 px-4'>
                            <a href='/products' className='font-bold text-xl select-none'>
                                Products
                            </a>
                        </li>
                        <VSpacer />
                        <li>
                            <Popover className='relative'>
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            className={`font-bold text-xl flex items-center my-2 py-1 px-4 focus-visible:outline-none select-none ${
                                                open ? 'bg-blue-200 text-primary-hover rounded-xl' : ''
                                            }`}
                                        >
                                            Categories <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} w-8 ml-2 transition-transform`} />
                                        </Popover.Button>
                                        <Transition
                                            as={Fragment}
                                            enter='transition ease-out duration-200'
                                            enterFrom='opacity-0 translate-y-0'
                                            enterTo='opacity-100 translate-y-1'
                                            leave='transition ease-in duration-150'
                                            leaveFrom='opacity-100 translate-y-1'
                                            leaveTo='opacity-0 translate-y-0'
                                        >
                                            <Popover.Panel className='absolute z-20'>
                                                <div className='flex flex-col pl-6 justify-center w-48 h-fit gap-1 bg-white rounded-md shadow-lg border-2 border-slate-300 py-4'>
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
                    </ul>
                </div>
                <div id='right' className={`flex items-center ${width > 932 ? '' : 'hidden'}`}>
                    {loggedIn ? (
                        <>
                            <a
                                href='/favorites'
                                id='Favorites'
                                className='flex items-center gap-2 text-xl rounded-md border-2 hover:bg-slate-100 p-2 text-primary-base hover:text-primary-hover hover:border-primary-base border-opacity-70 transition-all mr-4 group'
                            >
                                <HeartIcon className='w-6 group-hover:scale-[1.2] transition-transform duration-200' />
                            </a>
                            <a
                                href='/cart'
                                id='Cart'
                                className='flex items-center gap-2 text-xl rounded-md border-2 hover:bg-slate-100 p-2 text-primary-base hover:text-primary-hover hover:border-primary-base border-opacity-70 transition-all mr-8 group'
                            >
                                <ShoppingCartIcon className='w-6 group-hover:scale-[1.2] transition-transform duration-200' />
                            </a>
                        </>
                    ) : (
                        <>
                            <a
                                href='/favorites'
                                id='Favorites'
                                className='flex items-center gap-2 text-xl rounded-md border-2 hover:bg-slate-200 p-2 text-primary-base hover:text-primary-hover hover:border-primary-base border-opacity-70 transition-all'
                            >
                                <LoginIcon className='w-6' />
                            </a>
                            <Button id='Register' href='/register' as='a'>
                                Register
                            </Button>
                        </>
                    )}
                </div>
                <div id='mobile-btn' className={`flex ${width > 932 ? 'hidden' : ''} mx-12 inline-flex items-center justify-center rounded-md text-gray-700`}>
                    <button onClick={handleOpen} className='group'>
                        <span className='sr-only'>Open main menu</span>
                        <Bars3Icon className='h-6 w-6 text-primary-base group-focus:text-primary-hover' />
                    </button>
                </div>
            </nav>

            {/* END DESKTOP MENU */}

            {/* START MOBILE MENU */}

            <Dialog as='div' open={mobileMenuOpen} onClose={handleClose}>
                <div className='fixed inset-0 z-50' />
                <Dialog.Panel
                    id='mobile-panel'
                    className='transition-transform duration-300 -translate-x-full fixed inset-y-0 left-0 z-50 w-max overflow-y-auto bg-slate-50 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'
                >
                    <Dialog.Title className='flex justify-between border-b-2 border-b-slate-300 pb-8'>
                        <a href='/' className='w-fit h-fit'>
                            <img src='/favicon.ico' className='w-12 h-12' />
                        </a>
                        <button onClick={handleClose}>
                            <span className='sr-only'>Close Menu</span>
                            <XMarkIcon className='w-8' />
                        </button>
                    </Dialog.Title>
                    <div id='content' className='flow-root mt-8 pr-[20vw]'>
                        <ul id='navlinks' className='self-center items-start flex flex-col w-full h-full gap-6'>
                            <li className='flex items-center px-1'>
                                <a href='/' className='font-bold text-3xl select-none'>
                                    Home
                                </a>
                            </li>
                            <li className='flex items-center px-1'>
                                <a href='/products' className='font-bold text-3xl select-none'>
                                    Products
                                </a>
                            </li>
                            <li>
                                <h6 className='font-bold text-3xl flex items-center pb-4 px-4 -mx-3 focus-visible:outline-none select-none'>Categories</h6>
                                <div className='flex flex-col gap-2'>
                                    {categories.map((category, i) => (
                                        <div key={i} className='px-6 py-[0.2rem]'>
                                            <MobileCategory>{category}</MobileCategory>
                                            {i !== categories.length - 1 && <HSpacer />}
                                        </div>
                                    ))}
                                </div>
                            </li>
                        </ul>
                        <ul id='account' className='self-center items-start flex flex-col w-full h-full gap-4 mt-8'>
                            {loggedIn ? (
                                <>
                                    <Button id='Favorites' as='a' href='/favorites' secondary>
                                        Favorites <StarIcon className='w-6 mb-1' />
                                    </Button>
                                    <Button id='Cart' href='/cart' as='a' className='flex items-center gap-2 mx-0 mr-4'>
                                        Cart <ShoppingCartIcon className='w-[1.3rem]' />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <li className='flex items-center px-1 ml-1'>
                                        <Button href='/login' as='a' secondary className='font-bold text-xl select-none ml-0'>
                                            Login
                                        </Button>
                                    </li>
                                    <li className='flex items-center px-1'>
                                        <Button id='Register' href='/register' as='a' className='ml-0'>
                                            Register
                                        </Button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </Dialog.Panel>
            </Dialog>

            {/* END MOBILE MENU */}
        </header>
    );
};

export default Navbar;
