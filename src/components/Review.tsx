import React from 'react';
import { Review as TReview } from '@/types';
import Rating from './Rating';

interface Props {
    review: TReview;
}

const Review: React.FC<Props> = ({ review }: Props) => {
    const { comment, rating, user, createdAt } = review;
    return (
        <div id='Review' className='bg-slate-100 border shadow-xl w-full p-6 rounded-md'>
            <p className='text-xl font-bold'>{user}</p>
            <Rating rating={rating} className='py-2' />
            <p className='pt-2 text-md'>{comment}</p>
            <p className='pt-4 opacity-60'>Reviewed on {createdAt.toUTCString().slice(0, -13) /* E.g. "Fri, 27 Oct 2023" (exclude timezone, hour and minute) */}</p>
        </div>
    );
};

export default Review;
