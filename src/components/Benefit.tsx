import React, { useState } from 'react';
import Highlight from './Highlight';
import { motion } from 'framer-motion';

interface Props {
    Icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, 'ref'>>;
    title: string;
    subtitle: string;
    i: number;
}

const Benefit: React.FC<Props> = ({ Icon, title, subtitle, i }: Props) => {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, transition: { duration: 0.5, delay: 0.7 + i * 0.5 } }}
            className='flex flex-col items-center lg:w-1/4 -lg:mt-4'>
            <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <Highlight effect lighter force={hover}>
                    <Icon className='h-16 w-16' />
                </Highlight>
            </div>
            <h2 onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className='select-none py-3 text-4xl font-extrabold tracking-tight -md:text-2xl'>
                <Highlight effect force={hover}>
                    {title}
                </Highlight>
            </h2>
            <h6 className='text-center text-xl font-semibold -md:text-lg'>{subtitle}</h6>
        </motion.div>
    );
};

export default Benefit;
