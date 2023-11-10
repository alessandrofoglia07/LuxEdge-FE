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
        <a href={`/products?tags=${children === 'Living rooms' ? 'livingrooms' : children.toLowerCase()}`} className={`py-1 font-bold text-black ${className}`}>
            {children}
        </a>
    );
};

const MobileCategory: React.FC<CategoryProps> = ({ children, className }: CategoryProps) => {
    return (
        <a href={`/products?tags=${children === 'Living rooms' ? 'livingrooms' : children.toLowerCase()}`} className={`text-xl font-semibold text-slate-700 ${className}`}>
            {children}
        </a>
    );
};

const HSpacer = () => <hr className='mr-6' />;

const VSpacer = () => <div className='h-1/2 border-r-2 border-r-slate-300' />;

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

            <nav id='Navbar' className='bg-white-gradient fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between transition-all'>
                <div id='left'>
                    <div id='logo' className='flex items-center justify-self-start'>
                        <a className='h-min cursor-pointer select-none px-7 py-1 text-4xl font-extrabold tracking-tight sm:px-10' href='/'>
                            Lux<span className='text-primary-base hover:text-primary-hover'>Edge</span>
                        </a>
                    </div>
                </div>
                <div id='center' className={`h-full w-full lg:mx-[0] xl:mx-[12%] ${width > 932 ? '' : 'hidden'}`}>
                    <ul id='navlinks' className='flex h-full w-full items-center justify-evenly self-center justify-self-center'>
                        <li className='sm-pl-0 my-3 flex items-center pr-4 lg:pl-16'>
                            <a href='/' className='select-none text-xl font-bold'>
                                Home
                            </a>
                        </li>
                        <VSpacer />
                        <li className='my-3 flex items-center px-4'>
                            <a href='/products' className='select-none text-xl font-bold'>
                                Products
                            </a>
                        </li>
                        <VSpacer />
                        <li>
                            <Popover className='relative'>
                                {({ open }) => (
                                    <>
                                        <Popover.Button
                                            className={`my-2 flex select-none items-center px-4 py-1 text-xl font-bold focus-visible:outline-none ${
                                                open ? 'rounded-xl bg-blue-200 text-primary-hover' : ''
                                            }`}>
                                            Categories <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} ml-2 w-8 transition-transform`} />
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
                                                <div className='flex h-fit w-48 flex-col justify-center gap-1 rounded-lg border-2 border-slate-300 bg-white py-4 pl-6 shadow-lg'>
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
                                className='group mr-4 flex items-center gap-2 rounded-lg border-2 border-opacity-70 p-2 text-xl text-primary-base transition-all hover:border-primary-base hover:bg-slate-100 hover:text-primary-hover'
                                draggable={false}>
                                <HeartIcon className='w-6 transition-transform duration-200 group-hover:scale-[1.2] group-active:scale-95' />
                            </a>
                            <a
                                href='/cart'
                                id='Cart'
                                className='group mr-8 flex items-center gap-2 rounded-lg border-2 border-opacity-70 p-2 text-xl text-primary-base transition-all hover:border-primary-base hover:bg-slate-100 hover:text-primary-hover'
                                draggable={false}>
                                <ShoppingCartIcon className='w-6 transition-transform duration-200 group-hover:scale-[1.2] group-active:scale-95' />
                            </a>
                        </>
                    ) : (
                        <>
                            <a
                                href='/favorites'
                                id='Favorites'
                                className='flex items-center gap-2 rounded-lg border-2 border-opacity-70 p-2 text-xl text-primary-base transition-all hover:border-primary-base hover:bg-slate-200 hover:text-primary-hover'>
                                <LoginIcon className='w-6' />
                            </a>
                            <Button id='Register' href='/register' as='a'>
                                Register
                            </Button>
                        </>
                    )}
                </div>
                <div id='mobile-btn' className={`flex ${width > 932 ? 'hidden' : ''} mx-12 inline-flex items-center justify-center rounded-lg text-gray-700`}>
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
                    className='fixed inset-y-0 left-0 z-50 w-max -translate-x-full overflow-y-auto bg-slate-50 px-6 py-6 transition-transform duration-300 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
                    <Dialog.Title className='flex justify-between border-b-2 border-b-slate-300 pb-8'>
                        <a href='/' className='h-fit w-fit'>
                            <img src='/favicon.ico' className='h-12 w-12' />
                        </a>
                        <button onClick={handleClose}>
                            <span className='sr-only'>Close Menu</span>
                            <XMarkIcon className='w-8' />
                        </button>
                    </Dialog.Title>
                    <div id='content' className='mt-8 flow-root pr-[20vw]'>
                        <ul id='navlinks' className='flex h-full w-full flex-col items-start gap-6 self-center'>
                            <li className='flex items-center px-1'>
                                <a href='/' className='select-none text-3xl font-bold'>
                                    Home
                                </a>
                            </li>
                            <li className='flex items-center px-1'>
                                <a href='/products' className='select-none text-3xl font-bold'>
                                    Products
                                </a>
                            </li>
                            <li>
                                <h6 className='-mx-3 flex select-none items-center px-4 pb-4 text-3xl font-bold focus-visible:outline-none'>Categories</h6>
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
                        <ul id='account' className='mt-8 flex h-full w-full flex-col items-start gap-4 self-center'>
                            {loggedIn ? (
                                <>
                                    <Button id='Favorites' as='a' href='/favorites' secondary>
                                        Favorites <StarIcon className='mb-1 w-6' />
                                    </Button>
                                    <Button id='Cart' href='/cart' as='a' className='mx-0 mr-4 flex items-center gap-2'>
                                        Cart <ShoppingCartIcon className='w-[1.3rem]' />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <li className='ml-1 flex items-center px-1'>
                                        <Button href='/login' as='a' secondary className='ml-0 select-none text-xl font-bold'>
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
