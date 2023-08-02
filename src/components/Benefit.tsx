import React, { useState } from 'react';
import Highlight from './Highlight';

const Benefit = ({ Icon, title, subtitle }: { Icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, 'ref'>>; title: string; subtitle: string }) => {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <div className='flex flex-col items-center lg:w-1/4 -lg:mt-4'>
            <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <Highlight lighter force={hover}>
                    <Icon className='w-16 h-16' />
                </Highlight>
            </div>
            <h2 onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className='text-4xl font-extrabold py-3 select-none'>
                <Highlight force={hover}>{title}</Highlight>
            </h2>
            <h6 className='text-xl text-center font-semibold'>{subtitle}</h6>
        </div>
    );
};

export default Benefit;
