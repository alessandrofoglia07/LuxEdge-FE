import React from 'react';
import Navbar from '@/components/Navbar';

const HomePage: React.FC<any> = () => {
    return (
        <div id='HomePage'>
            <header>
                <Navbar />
            </header>
            <main className='bg-slate-100 h-screen'></main>
        </div>
    );
};

export default HomePage;
