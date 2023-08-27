import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import useSelector from '@/hooks/useSelector';
import LuxEdge from '@/components/LuxEdgeLogo';
import { Navigate } from 'react-router-dom';
import Input from '@/components/CustomElements/StyledInput';
import Button from '@/components/CustomElements/StyledButton';
// import { z } from 'zod';

const LoginPage: React.FC = () => {
    const { accessToken } = useSelector((state) => state.auth);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const body = document.querySelector('body');
        body?.classList.add('bg-slate-200');
        return () => body?.classList.remove('bg-slate-200');
    }, []);

    return accessToken ? (
        <Navigate to='/products' />
    ) : (
        <div id='LoginPage'>
            <Navbar />
            <main className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center w-min h-min rounded-lg'>
                <div
                    id='presentation'
                    className={`w-96 h-[36rem] rounded-lg rounded-r-none -md:hidden bg-gradient-to-br from-blue-500 to-blue-700
                        flex flex-col justify-between
                        before:bg-white before:opacity-0 before:absolute before:w-96 before:h-full`}>
                    <div id='top' className='h-12 w-max px-4 py-2'>
                        <LuxEdge monochromeRev id='logo' className='text-4xl' />
                    </div>
                    <div id='center' className='h-max w-full flex items-center'>
                        <h2 className='text-center text-[2.7rem] font-bold text-white px-4 tracking-tight'>Welcome back.</h2>
                        <div
                            className='w-0 h-0 ml-auto'
                            style={{ borderTop: '30px solid transparent', borderBottom: '30px solid transparent', borderRight: '30px solid rgb(255 255 255)' }}
                        />
                    </div>
                    <div id='bottom' className='h-12 w-max px-4 py-2'>
                        <p className='text-sm text-white font-semibold'>{new Date().getFullYear()} LuxEdge Furnitures.</p>
                    </div>
                </div>
                <div id='form' className='w-96 h-[36rem] rounded-lg md:rounded-l-none bg-white flex flex-col items-center'>
                    <div id='top' className='py-8'>
                        <h2 className='font-extrabold text-center text-[2.7rem] tracking-tight'>Login</h2>
                    </div>
                    <form autoComplete='off' spellCheck='false'>
                        <div id='center' className='h-max w-full flex flex-col gap-4 items-center mt-8'>
                            <Input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} containerClassName='w-3/4' />
                            <Input
                                type='email'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                helperText='Invalid email address.'
                                containerClassName='w-3/4'
                            />
                            <Input
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                helperText='Password must contain 8-20 characters.'
                                containerClassName='w-3/4'
                            />
                        </div>
                        <div id='bottom' className='w-full flex flex-col mt-12 items-center'>
                            <Button type='submit' className='w-3/4'>
                                Login
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
