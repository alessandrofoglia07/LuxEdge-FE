import React, { useState, useEffect, Fragment } from 'react';
import Navbar from '@/components/Navbar';
import { Product } from '@/types';
import axios, { isAxiosError } from 'axios';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import Footer from '@/components/Footer';
import Option from '@/components/Option';
import ProductCard from '@/components/ProductCardExpanded';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import Pagination from '@/components/Pagination';
import useAuth from '@/hooks/useAuth';
import getFavsList from '@/utils/getFavsList';
import Spinner from '@/components/Spinner';
import Favorites from '@/redux/persist/Favorites';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { toSingular } from '@/utils/singularPlural';
import { categories } from '@/components/Navbar';
import { motion } from 'framer-motion';

const sortOptions = [
    { id: 1, name: 'Recommend' },
    { id: 2, name: 'Price: Low to High' },
    { id: 3, name: 'Price: High to Low' },
    { id: 4, name: 'Newest' },
    { id: 5, name: 'Oldest' }
];

const RatingRanges = [
    { name: '3 Stars', checked: false, url: '3stars' },
    { name: '4 Stars', checked: false, url: '4stars' },
    { name: '5 Stars', checked: false, url: '5stars' }
];

interface Category {
    name: string;
    checked: boolean;
    url: string;
}

interface PriceRangeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PriceRangeInput: React.FC<PriceRangeInputProps> = (props: PriceRangeInputProps) => {
    return (
        <div className='w-2/3 bg-slate-200 my-2 rounded-md flex items-center'>
            <p className='pr-2 pl-4'>$</p>
            <input type='number' className='w-full bg-slate-200 p-2 rounded-md leading-3 outline-none tracking-tight' max={1000000} min={0} {...props} />
        </div>
    );
};

const ProductsPage: React.FC = () => {
    const isAuth = useAuth();

    const [productsCount, setProductsCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(
        categories.map((category) => ({ name: category, checked: false, url: category.toLowerCase().replace(/\s/g, '') }))
    );
    const [selectedRatingRanges, setSelectedRatingRanges] = useState<Category[]>(RatingRanges);
    const [priceRange, setPriceRange] = useState<[string, string]>(['', '']);
    const [favsList, setFavsList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [ready, setReady] = useState<boolean>(false);

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
    const [mobileFiltersTimeout, setMobileFiltersTimeout] = useState<number>(0);

    const [searchParams, setSearchParams] = useSearchParams();

    // Get state from URL
    const getStateFromURL = () => {
        setLoading(true);
        const tags = searchParams.get('tags')?.split(' ');
        const priceRanges = searchParams.get('price')?.split('-');
        const ratingRanges = searchParams.get('rating')?.split(' ');
        let page = searchParams.get('page');

        if (!page) {
            searchParams.set('page', '1');
            setSearchParams(searchParams, { replace: true });
            page = '1';
        }

        if (tags) {
            setSelectedCategories((prev) => {
                return prev.map((prevCategory) => (tags.includes(prevCategory.url) ? { ...prevCategory, checked: true } : prevCategory));
            });
        }
        if (priceRanges) {
            setPriceRange(priceRanges as [string, string]);
        }
        if (ratingRanges) {
            setSelectedRatingRanges((prev) => {
                return prev.map((prevRatingRange) => (ratingRanges.includes(prevRatingRange.url) ? { ...prevRatingRange, checked: true } : prevRatingRange));
            });
        }
        setPage(parseInt(page));
        setLoading(false);
        setReady(true);
    };

    // On load, get state from URL
    useEffect(() => {
        getStateFromURL();
    }, []);

    // Get favs list
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

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
                setLoading(false);
            }
        })();
    }, [isAuth]);

    const handleMobileFiltersOpen = () => {
        if (Date.now() - mobileFiltersTimeout < 100) return;

        setMobileFiltersOpen(true);

        setTimeout(() => {
            const panel = document.getElementById('filters-menu-mobile');

            if (panel) {
                panel.classList.remove('translate-x-full');
            }
        }, 50);

        setMobileFiltersTimeout(Date.now());
    };

    const handleMobileFiltersClose = () => {
        if (Date.now() - mobileFiltersTimeout < 100) return;

        const panel = document.getElementById('filters-menu-mobile');

        if (panel) {
            panel.classList.add('translate-x-full');
        }

        setTimeout(() => {
            setMobileFiltersOpen(false);
            setMobileFiltersTimeout(Date.now());
        }, 300);
    };

    // Update URL based on state
    const updateURL = () => {
        const tags = selectedCategories.filter((category) => category.checked).map((category) => category.url);
        const ratingRanges = selectedRatingRanges.filter((ratingRange) => ratingRange.checked).map((ratingRange) => ratingRange.url);

        searchParams.set('page', page.toString());

        if (tags.length > 0) {
            searchParams.set('tags', tags.join(' '));
        } else {
            searchParams.delete('tags');
        }

        if (priceRange[0] !== '' || priceRange[1] !== '') {
            searchParams.set('price', priceRange.join('-'));
        } else {
            searchParams.delete('price');
        }

        if (ratingRanges.length > 0) {
            searchParams.set('rating', ratingRanges.join(' '));
        } else {
            searchParams.delete('rating');
        }

        setSearchParams(searchParams, { replace: true });
    };

    // Fetch products
    const fetchProducts = async (tags: string, price: [number, number], rating: string, sort: string, limit: string, page: string) => {
        try {
            setLoading(true);

            const queries = [];

            const queryParams = {
                tags:
                    tags &&
                    tags
                        .split(',')
                        .map((tag) => toSingular(tag))
                        .join(','),
                price,
                rating,
                sort,
                limit,
                page
            };

            for (const key in queryParams) {
                const val = queryParams[key as keyof typeof queryParams];
                if (val) {
                    queries.push(`${key}=${val}`);
                }
            }

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/search?${queries.join('&')}`);
            setProducts(res.data.products);
            setProductsCount(res.data.count);
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                throw err.response?.data;
            } else if (typeof err === 'string') {
                throw new Error(err);
            } else {
                console.log(err);
            }
        } finally {
            setLoading(false);
        }
    };

    // On state change, update URL and fetch products
    useEffect(() => {
        if (!ready) return;

        updateURL();

        const tags = selectedCategories
            .filter((category) => category.checked)
            .map((category) => category.url)
            .join(',');

        const ratingRanges = selectedRatingRanges
            .filter((ratingRange) => ratingRange.checked)
            .map((ratingRange) => ratingRange.url)
            .join(',');

        const sortMap = new Map<string, string>([
            [sortOptions[0].name, 'recommend'],
            [sortOptions[1].name, 'price_asc'],
            [sortOptions[2].name, 'price_desc'],
            [sortOptions[3].name, 'newest'],
            [sortOptions[4].name, 'oldest']
        ]);

        const newPriceRange = priceRange.map((val, i) => {
            if (val === '') {
                if (i === 0) {
                    return 0;
                }
                return 1000000;
            }
            return parseInt(val);
        }) as [number, number];

        fetchProducts(tags, newPriceRange, ratingRanges, sortMap.get(selectedSort.name) || 'recommend', '12', page.toString());
    }, [page, selectedSort, selectedCategories, priceRange, selectedRatingRanges, searchParams, ready]);

    const handleCategoryChange = (category: Category) => {
        setSelectedCategories((prev) => {
            return prev.map((prevCategory) => (prevCategory.name === category.name ? { ...prevCategory, checked: !prevCategory.checked } : prevCategory));
        });
    };

    const handleRatingRangeChange = (ratingRange: Category) => {
        setSelectedRatingRanges((prev) => {
            return prev.map((prevRatingRange) => (prevRatingRange.name === ratingRange.name ? { ...prevRatingRange, checked: !prevRatingRange.checked } : prevRatingRange));
        });
    };

    const handlePriceRangeChange = (i: number, val: unknown) => {
        const validate = z.string().safeParse(val);

        if (validate.success) {
            setPriceRange((prev) => {
                const newPriceRange = [...prev];
                newPriceRange[i] = validate.data;
                return newPriceRange as [string, string];
            });
        }
    };

    // On page change, update page state
    const onPageChange = (page: number) => {
        setPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle favorite
    const handleFavorite = (val: boolean, _id: string) => {
        if (val) {
            setFavsList((prev) => [...prev, _id]);
            Favorites.add(_id);
        } else {
            setFavsList((prev) => prev.filter((id) => id !== _id));
            Favorites.remove(_id);
        }
    };

    return (
        <div id='ProductsPage'>
            <Navbar />
            <main className='pt-16 mx-auto w-[calc(100vw - 9px)] flex flex-col items-center min-h-page'>
                <div className='md:w-3/4 w-full flex flex-col mb-36'>
                    <div id='mid' className='w-full self-center mt-8 h-max flex -md:flex-col -md:gap-4 items-center justify-between py-4 px-4'>
                        <h6>
                            <span className='font-semibold'>
                                Showing {!loading ? Math.min(1 + (page - 1) * 12, productsCount) : '...'} - {!loading ? Math.min(12 + (page - 1) * 12, productsCount) : '...'}
                            </span>{' '}
                            out of {!loading ? productsCount : '...'} products
                        </h6>
                        <div className='-md:w-full -md:flex justify-center gap-2'>
                            <Listbox value={selectedSort} onChange={setSelectedSort}>
                                <div className='relative z-10'>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Listbox.Button className='relative w-64 h-11 md:h-auto -md:w-[40vw] -md:text-center rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg border border-slate-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light sm:text-sm'>
                                            <span className='block truncate font-semibold'>{selectedSort.name}</span>
                                            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                                                <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                            </span>
                                        </Listbox.Button>
                                    </motion.div>
                                    <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
                                        <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                                            {sortOptions.map((sortOption, idx) => (
                                                <Listbox.Option
                                                    key={idx}
                                                    className={({ active }) =>
                                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-gray-900' : 'text-gray-900'}`
                                                    }
                                                    value={sortOption}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{sortOption.name}</span>
                                                            {selected ? (
                                                                <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-primary-base'>
                                                                    <CheckIcon className='h-5 w-5' aria-hidden='true' />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                            <button
                                onClick={handleMobileFiltersOpen}
                                className='md:hidden relative h-11 w-[40vw] rounded-lg font-semibold bg-white py-2 text-center shadow-lg border border-slate-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light sm:text-sm flex justify-center items-center gap-2'
                            >
                                Filter
                                <FunnelIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                            </button>
                        </div>
                    </div>
                    <div id='main' className='w-full self-center h-max flex -md:flex-col'>
                        <aside id='filters-menu-desktop' className='w-72 h-max -md:hidden'>
                            <div className='ml-4 w-[calc(100% - 1rem)] h-max flex flex-col'>
                                <h2 className='text-xl font-bold border-b py-4 border-b-slate-300 uppercase'>
                                    <b>Filters</b>
                                </h2>
                                <div className='border-b border-b-slate-200 py-2'>
                                    <h2 className='text-md py-2 uppercase'>
                                        <b>Categories</b>
                                    </h2>
                                    {selectedCategories.map((category, i) => (
                                        <Option key={i} checked={category.checked} onClick={() => handleCategoryChange(category)} className='py-1'>
                                            {category.name}
                                        </Option>
                                    ))}
                                </div>
                                <div className='border-b border-b-slate-200 py-2'>
                                    <h2 className='text-md py-2 uppercase'>
                                        <b>Price</b>
                                    </h2>
                                    <div className='flex flex-col'>
                                        <div className='flex justify-between items-center'>
                                            <p>From:</p>
                                            <PriceRangeInput value={priceRange[0]} placeholder='0' onChange={(e) => handlePriceRangeChange(0, e.target.value)} />
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <p>To:</p>
                                            <PriceRangeInput value={priceRange[1]} placeholder='1000000' onChange={(e) => handlePriceRangeChange(1, e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className='border-b border-b-slate-200 py-2'>
                                    <h2 className='text-md py-2 uppercase'>
                                        <b>Rating</b>
                                    </h2>
                                    {selectedRatingRanges.map((ratingRange, i) => (
                                        <Option key={i} checked={ratingRange.checked} onClick={() => handleRatingRangeChange(ratingRange)} className='py-1'>
                                            {ratingRange.name}
                                        </Option>
                                    ))}
                                </div>
                            </div>
                        </aside>
                        <div className='w-full h-full flex flex-col items-center'>
                            {loading ? (
                                <Spinner className='mt-[20vh]' />
                            ) : (
                                <>
                                    <section id='products' className='grid place-items-center w-full'>
                                        <div className='responsive-grid'>
                                            {products.map((product, i) => (
                                                <ProductCard key={i} product={product} isFavorite={favsList.some((id) => id === product._id)} setIsFavorite={handleFavorite} />
                                            ))}
                                        </div>
                                    </section>
                                    {products.length !== 0 && <Pagination currentPage={page} pageSize={12} totalCount={productsCount} onPageChange={onPageChange} />}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
            <Dialog as='div' open={mobileFiltersOpen} onClose={handleMobileFiltersClose}>
                <div className='fixed inset-0 z-50' />
                <Dialog.Panel
                    id='filters-menu-mobile'
                    className='transition-transform duration-300 translate-x-full fixed inset-y-0 right-0 z-50 w-max overflow-y-auto bg-slate-50 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'
                >
                    <Dialog.Title className='flex flex-col items-center border-b-2 border-b-slate-300 pb-4'>
                        <div className='flex justify-between w-full'>
                            <a href='/' className='w-fit h-fit'>
                                <img src='/favicon.ico' className='w-12 h-12' />
                            </a>
                            <button onClick={handleMobileFiltersClose}>
                                <span className='sr-only'>Close Menu</span>
                                <XMarkIcon className='w-8' />
                            </button>
                        </div>
                        <span className='text-xl font-bold uppercase mt-4'>
                            <b>Filters</b>
                        </span>
                    </Dialog.Title>
                    <div id='content' className='flow-root mt-4 pr-[10vw]'>
                        <div className='border-b border-b-slate-200 py-2'>
                            <h2 className='text-md py-2 uppercase'>
                                <b>Categories</b>
                            </h2>
                            {selectedCategories.map((category, i) => (
                                <Option key={i} checked={category.checked} onClick={() => handleCategoryChange(category)} className='py-1'>
                                    {category.name}
                                </Option>
                            ))}
                        </div>
                        <div className='border-b border-b-slate-200 py-2'>
                            <h2 className='text-md py-2 uppercase'>
                                <b>Price</b>
                            </h2>
                            <div className='flex flex-col'>
                                <div className='flex justify-between items-center'>
                                    <p>From:</p>
                                    <PriceRangeInput value={priceRange[0]} placeholder='0' onChange={(e) => handlePriceRangeChange(0, e.target.value)} />
                                </div>
                                <div className='flex justify-between items-center'>
                                    <p>To:</p>
                                    <PriceRangeInput value={priceRange[1]} placeholder='1000000' onChange={(e) => handlePriceRangeChange(1, e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className='border-b border-b-slate-200 py-2'>
                            <h2 className='text-md py-2 uppercase'>
                                <b>Rating</b>
                            </h2>
                            {selectedRatingRanges.map((ratingRange, i) => (
                                <Option key={i} checked={ratingRange.checked} onClick={() => handleRatingRangeChange(ratingRange)} className='py-1'>
                                    {ratingRange.name}
                                </Option>
                            ))}
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    );
};

export default ProductsPage;
