import React from 'react';
import { Review as TReview } from '@/types';

interface Props {
    review: TReview;
}

// TODO: Implement Review component
const Review: React.FC<Props> = ({ review }: Props) => {
    return (
        <div id='Review'>
            <h1>Review</h1>
        </div>
    );
};

export default Review;
