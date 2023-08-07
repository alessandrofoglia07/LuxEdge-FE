import React from 'react';

interface Props {
    src: string;
    alt: string;
    className?: string;
    draggable?: boolean;
}

const Img: React.FC<Props> = ({ src, alt, className = '', draggable = false }: Props) => (
    <img src={src} alt={alt} className={`${className} object-cover select-none`} draggable={draggable} />
);

export default Img;
