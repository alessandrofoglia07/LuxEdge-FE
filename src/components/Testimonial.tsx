import React from 'react';
import { Testimonial as TestimonialType } from '@/types';
import Rating from './Rating';
import Img from './CustomImg';

interface Props {
    testimonial: TestimonialType;
}

const Testimonial: React.FC<Props> = ({ testimonial }: Props) => {
    return (
        <div id='Testimonial' className='w-96 -lg:w-2/3 bg-white shadow-xl after:w-96 after:opacity-0 after:shadow-2xl hover:after:opacity-1 flex flex-col items-center p-4'>
            <Img src={testimonial.pfpPath} alt='client-profile-pic' className='aspect-square rounded-full w-1/3' />
            <h2 className='font-bold text-xl tracking-wide py-2'>{testimonial.author}</h2>
            <Rating className='py-2' rating={testimonial.rating} />
            <p className='py-4 opacity-50 font-semibold tracking-wide px-2 text-center'>{testimonial.text}</p>
        </div>
    );
};

export default Testimonial;
