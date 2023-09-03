/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, Fragment } from 'react';
import Navbar from '@/components/Navbar';
import categories from '@/assets/productCategories';
import { Product } from '@/types';
import axios from 'axios';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Footer from '@/components/Footer';
import Option from '@/components/Option';
import { mockProducts } from '@/assets/mock';
import ProductCard from '@/components/ProductCard';

const sortOptions = [
    { id: 1, name: 'Recommend' },
    { id: 2, name: 'Price: Low to High' },
    { id: 3, name: 'Price: High to Low' },
    { id: 4, name: 'Newest' },
    { id: 5, name: 'Oldest' }
];

const PriceRanges = [
    { name: 'Under $50', checked: false },
    { name: '$50 to $100', checked: false },
    { name: '$100 to $200', checked: false },
    { name: '$200 to $500', checked: false },
    { name: '$500 to $1000', checked: false },
    { name: 'Over $1000', checked: false }
];

const RatingRanges = [
    { name: '3 Stars', checked: false },
    { name: '4 Stars', checked: false },
    { name: '5 Stars', checked: false }
];

interface Category {
    name: string;
    checked: boolean;
}

const ProductsPage: React.FC = () => {
    const [productsCount, setProductsCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(categories.map((category) => ({ name: category, checked: false })));
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<Category[]>(PriceRanges);
    const [selectedRatingRanges, setSelectedRatingRanges] = useState<Category[]>(RatingRanges);

    useEffect(() => {
        setProductsCount(mockProducts.length);
        setProducts(mockProducts.slice((page - 1) * 12, page * 12));
    }, []);

    return (
        <div id='ProductsPage'>
            <Navbar />
            <main className='pt-16 mx-auto w-[calc(100vw - 9px)] flex flex-col items-center h-screen'>
                <div className='md:w-3/4 w-full flex flex-col'>
                    <div id='top' className='w-full self-center bg-primary-base my-12 py-8 md:rounded-md'>
                        <h1 className='text-white font-bold text-3xl px-8 tracking-tight'>Products</h1>
                    </div>
                    <div id='mid' className='w-full self-center h-max flex -md:flex-col -md:gap-4 items-center justify-between py-4 px-4'>
                        <h6>
                            <span className='font-semibold'>
                                Showing {1 + (page - 1) * 12} - {12 + (page - 1) * 12}
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
                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-gray-900' : 'text-gray-900'}`
                                                }
                                                value={sortOption}>
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
                                        <Option
                                            key={i}
                                            checked={category.checked}
                                            onClick={() =>
                                                setSelectedCategories((prev) =>
                                                    prev.map((prevCategory) =>
                                                        prevCategory.name === category.name ? { ...prevCategory, checked: !prevCategory.checked } : prevCategory
                                                    )
                                                )
                                            }
                                            className='py-1'>
                                            {category.name}
                                        </Option>
                                    ))}
                                </div>
                                <div className='border-b border-b-slate-200 py-2'>
                                    <h2 className='text-md py-2 uppercase'>
                                        <b>Price</b>
                                    </h2>
                                    {selectedPriceRanges.map((priceRange, i) => (
                                        <Option
                                            key={i}
                                            checked={priceRange.checked}
                                            onClick={() =>
                                                setSelectedPriceRanges((prev) =>
                                                    prev.map((prevPriceRange) =>
                                                        prevPriceRange.name === priceRange.name ? { ...prevPriceRange, checked: !prevPriceRange.checked } : prevPriceRange
                                                    )
                                                )
                                            }
                                            className='py-1'>
                                            {priceRange.name}
                                        </Option>
                                    ))}
                                </div>
                                <div className='border-b border-b-slate-200 py-2'>
                                    <h2 className='text-md py-2 uppercase'>
                                        <b>Rating</b>
                                    </h2>
                                    {selectedRatingRanges.map((ratingRange, i) => (
                                        <Option
                                            key={i}
                                            checked={ratingRange.checked}
                                            onClick={() =>
                                                setSelectedRatingRanges((prev) =>
                                                    prev.map((prevRatingRange) =>
                                                        prevRatingRange.name === ratingRange.name ? { ...prevRatingRange, checked: !prevRatingRange.checked } : prevRatingRange
                                                    )
                                                )
                                            }
                                            className='py-1'>
                                            {ratingRange.name}
                                        </Option>
                                    ))}
                                </div>
                            </div>
                        </aside>
                        <section id='products' className='grid place-items-center w-fit'>
                            <div className='flex flex-wrap justify-center -md:gap-2'>
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
