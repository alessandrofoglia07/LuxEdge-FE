import React from 'react';
import Star from './Star';

interface Props {
    rating: number;
    max?: number;
    className?: string;
}

const Rating: React.FC<Props> = ({ rating, max = 5, className = '' }: Props) => {
    return (
        <div className={`flex items-centers ${className}`}>
            {Array.from({ length: Math.floor(rating) }, (_, i) => (
                <Star key={i} variant='filled' />
            ))}
            {!Number.isInteger(rating) && <Star variant='half' />}
            {Array.from({ length: max - Math.ceil(rating) }, (_, i) => (
                <Star key={i} variant='empty' />
            ))}
        </div>
    );
};

export default Rating;
