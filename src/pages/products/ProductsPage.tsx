import React, { useState, useEffect, Fragment } from 'react';
import Navbar from '@/components/Navbar';
import categories from '@/assets/productCategories';
import { Product } from '@/types';
import axios, { AxiosError } from 'axios';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Footer from '@/components/Footer';
import Option from '@/components/Option';
import ProductCard from '@/components/ProductCardExpanded';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

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
        <div className='w-2/3 bg-slate-200 my-2 rounded-md flex items-center focus-within:outline focus-within:outline-blue-500 focus-within:outline-offset-1'>
            <p className='pr-2 pl-4'>$</p>
            <input type='number' className='w-full bg-slate-200 p-2 rounded-md leading-3 outline-none tracking-tight' max={1000000} min={0} {...props} />
        </div>
    );
};

const ProductsPage: React.FC = () => {
    const [productsCount, setProductsCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(
        categories.map((category) => ({ name: category, checked: false, url: category.toLowerCase().replace(/\s/g, '') }))
    );
    const [selectedRatingRanges, setSelectedRatingRanges] = useState<Category[]>(RatingRanges);
    const [priceRange, setPriceRange] = useState<[string, string]>(['', '']);

    const [searchParams, setSearchParams] = useSearchParams();

    const getStateFromURL = () => {
        const tags = searchParams.get('tags')?.split(' ');
        const priceRanges = searchParams.get('price')?.split('-');
        const ratingRanges = searchParams.get('rating')?.split(' ');
        const page = searchParams.get('page') || '1';
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
    };

    useEffect(() => {
        getStateFromURL();
    }, []);

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

    const fetchProducts = async (tags: string, price: [number, number], rating: string, sort: string, limit: string, page: string) => {
        try {
            const queries = [];

            const queryParams = {
                tags:
                    tags &&
                    tags
                        .split(',')
                        .map((tag) => (tag === 'Bookshelves' ? 'bookshelf' : tag.toLowerCase().slice(0, -1)))
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
            if (err instanceof AxiosError) {
                throw err.response?.data;
            } else if (typeof err === 'string') {
                throw new Error(err);
            } else {
                console.log(err);
            }
        }
    };

    useEffect(() => {
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
    }, [page, selectedSort, selectedCategories, priceRange, selectedRatingRanges, searchParams]);

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

    return (
        <div id='ProductsPage'>
            <Navbar />
            <main className='pt-16 mx-auto w-[calc(100vw - 9px)] flex flex-col items-center h-screen'>
                <div className='md:w-3/4 w-full flex flex-col'>
                    <div id='mid' className='w-full self-center mt-8 h-max flex -md:flex-col -md:gap-4 items-center justify-between py-4 px-4'>
                        <h6>
                            <span className='font-semibold'>
                                Showing {Math.min(1 + (page - 1) * 12, productsCount)} - {Math.min(12 + (page - 1) * 12, productsCount)}
                            </span>{' '}
                            out of {productsCount} products
                        </h6>
                        <Listbox value={selectedSort} onChange={setSelectedSort}>
                            <div className='relative mt-1 z-10'>
                                <Listbox.Button className='relative w-64 rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-lg border border-slate-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light sm:text-sm'>
                                    <span className='block truncate font-semibold'>{selectedSort.name}</span>
                                    <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                                        <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                    </span>
                                </Listbox.Button>
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
                    </div>
                    <div id='main' className='w-full self-center h-max flex'>
                        <aside id='sidebar' className='w-72 h-max -md:hidden'>
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
                        <section id='products' className='grid place-items-center w-full'>
                            <div className='responsive-grid'>
                                {products.map((product, i) => (
                                    <ProductCard key={i} product={product} />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default ProductsPage;
