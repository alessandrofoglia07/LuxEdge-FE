import React from 'react';
import { Testimonial as TestimonialType } from '@/types';
import Rating from './Rating';
import Img from './CustomElements/CustomImg';

interface Props {
    testimonial: TestimonialType;
}

const Testimonial: React.FC<Props> = ({ testimonial }: Props) => {
    return (
        <div
            id='Testimonial'
            className='flex h-max max-w-sm flex-col items-center bg-white p-4 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl md:h-[26rem] -lg:w-2/3'>
            <Img src={testimonial.pfpPath} alt='client-profile-pic' className='aspect-square w-1/3 rounded-full' />
            <h2 className='py-2 text-xl font-bold tracking-wide'>{testimonial.author}</h2>
            <Rating className='py-2' rating={testimonial.rating} />
            <p className='px-2 py-4 text-center font-semibold tracking-wide opacity-50'>{testimonial.text}</p>
        </div>
    );
};

export default Testimonial;
