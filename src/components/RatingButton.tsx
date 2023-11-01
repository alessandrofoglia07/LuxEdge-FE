import React, { useState } from 'react';
import Star from './Star';
import { motion } from 'framer-motion';

interface Props {
    init: number;
    max?: number;
    className?: string;
    onChange: (rating: number) => void;
}

const RatingButton: React.FC<Props> = ({ init, max = 5, className = '', onChange }: Props) => {
    const [selectedRating, setSelectedRating] = useState(init);
    const [hoveredRating, setHoveredRating] = useState(init);
    const [hovering, setHovering] = useState(false);

    const handleRatingClick = (newRating: number) => {
        setSelectedRating(newRating);
        onChange(newRating);
    };

    return (
        <div
            onMouseEnter={() => {
                setHovering(true);
            }}
            onMouseLeave={() => {
                setHovering(false);
            }}
            className={`flex items-center ${className}`}
        >
            {Array.from({ length: max }, (_, i) => (
                <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    key={i}
                    onClick={() => handleRatingClick(i)}
                    onMouseEnter={() => {
                        setHoveredRating(i);
                    }}
                >
                    <Star variant={!hovering ? (i <= selectedRating ? 'filled' : 'empty') : i <= hoveredRating ? 'filled' : 'empty'} />
                </motion.button>
            ))}
        </div>
    );
};

export default RatingButton;
