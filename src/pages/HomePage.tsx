import React from 'react';
import Navbar from '@/components/Navbar';

const HomePage: React.FC<any> = () => {
    return (
        <div id='HomePage'>
            <Navbar />
            <main className='h-screen'></main>
        </div>
    );
};

export default HomePage;
