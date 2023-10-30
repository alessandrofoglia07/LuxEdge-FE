import React, { useState } from 'react';
import LuxEdge from './LuxEdgeLogo';
import categories from '@/utils/categories';
import { PlayIcon } from '@heroicons/react/20/solid';
import { z } from 'zod';
import axios, { isAxiosError } from 'axios';

interface Item {
    name: string;
    url: string;
}

interface ListProps {
    title: string | React.ReactNode;
    items: Item[];
}

const items1 = [
    {
        name: 'Home',
        url: '/'
    },
    {
        name: 'Products',
        url: '/products'
    },
    {
        name: 'Login',
        url: '/login'
    },
    {
        name: 'Register',
        url: '/register'
    }
];

const items2 = categories.map((category) => ({
    name: category,
    url: `/products?tags=${category.toLowerCase()}`
}));

const List: React.FC<ListProps> = ({ title, items }: ListProps) => (
    <div className='flex flex-col gap-[0.1rem]'>
        {typeof title === 'string' ? <h3 className='font-bold text-2xl pt-1 text-slate-200 select-none pb-3'>{title}</h3> : title}
        {items.map(({ name, url }: Item, i) => (
            <a key={i} href={url} className='transition-all font-semibold w-max tracking-tight text-lg text-slate-500 hover:text-slate-400'>
                {name}
            </a>
        ))}
    </div>
);

interface FooterProps {
    className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }: FooterProps) => {
    const [email, setEmail] = useState('');
    const [helperText, setHelperText] = useState('We will never share your email address.');

    const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validate = z.string().email().safeParse(email);

        try {
            if (validate.success) {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter/subscribe`, { email });

                if (res.status === 201) {
                    setHelperText('Thank you for subscribing!');
                } else {
                    setHelperText('Something went wrong. Please try again later.');
                }

                setEmail('');
            } else {
                setHelperText('Please enter a valid email address.');
            }
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setHelperText('This email address is already subscribed.');
                    throw err;
                }

                setHelperText(err.response?.data.message);
                throw err;
            } else if (typeof err === 'string') {
                setHelperText(err);
                throw new Error(err);
            } else {
                setHelperText('Something went wrong. Please try again later.');
                console.log(err);
            }
        }
    };

    return (
        <footer className={`relative bottom-0 flex flex-col w-full items-center ${className}`}>
            <div className='bg-slate-700 flex justify-evenly flex-wrap gap-4 w-full py-8 px-4'>
                <List title={<LuxEdge className='select-none text-3xl pb-4 text-slate-200 [&>*]:text-slate-200' />} items={items1} />
                <List title='Products' items={items2} />
                <div id='subscribe-to-newsletter'>
                    <h1 className='py-1 font-bold text-white text-2xl capitalize tracking-tight select-none'>Don't miss out.</h1>
                    <h3 className='py-2 text-xl font-bold text-slate-500'>Sign up for our Newsletter</h3>
                    <form onSubmit={handleNewsletterSubmit} className='py-3 flex items-center'>
                        <input
                            className='w-full h-12 pl-4 py-2 pr-2 rounded-l-sm focus:outline-none font-semibold placeholder:font-normal text-slate-800'
                            required
                            autoComplete='off'
                            autoCorrect='off'
                            autoCapitalize='off'
                            spellCheck='false'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email address*'
                        />
                        <button
                            type='submit'
                            className='aspect-square h-12 p-2 rounded-r-sm border-2 border-white grid place-items-center hover:bg-slate-800 transition-colors duration-200'
                        >
                            <PlayIcon className='w-6 text-slate-100' />
                        </button>
                    </form>
                    <h6 id='helperText' className='text-slate-50 font-semibold text-xl -md:max-w-full -md:w-fit'>
                        {helperText}
                    </h6>
                </div>
            </div>
            <div id='copyright' className='w-full h-max bg-slate-800'>
                <p className='text-slate-500 py-2 text-center tracking-tight'> Copyright&copy; {new Date().getFullYear()} LuxEdge Furnitures. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
