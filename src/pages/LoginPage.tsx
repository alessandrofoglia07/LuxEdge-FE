import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import useSelector from '@/hooks/useSelector';
import LuxEdge from '@/components/LuxEdgeLogo';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const { accessToken } = useSelector((state) => state.auth);

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
                    className={`w-96 h-[36rem] rounded-lg rounded-r-none -md:hidden bg-login-bg bg-no-repeat bg-center bg-cover bg-fixed
                        flex flex-col justify-between
                        before:bg-white before:opacity-0 before:absolute before:w-96 before:h-full`}>
                    <div id='top' className='h-max w-max px-4 py-2'>
                        <LuxEdge monochromeRev id='logo' className='text-4xl' />
                    </div>
                    <div id='center' className='h-max w-max px-4 -mt-4'>
                        <h2 className='text-center text-[2.5rem] font-bold text-white'>Welcome back.</h2>
                    </div>
                    <div id='bottom' className='h-max w-max px-4 py-2'>
                        <p className='text-sm text-white font-semibold'>{new Date().getFullYear()} LuxEdge Furnitures.</p>
                    </div>
                </div>
                <div id='form' className='w-96 h-[36rem] rounded-lg md:rounded-l-none bg-white'></div>
            </main>
        </div>
    );
};

export default LoginPage;
