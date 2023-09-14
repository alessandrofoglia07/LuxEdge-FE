import React, { ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    draggable?: boolean;
}

const Img: React.FC<Props> = (props: Props) => {
    const newProps: ImgHTMLAttributes<HTMLImageElement> = { ...props };
    delete newProps.src;
    delete newProps.alt;
    delete newProps.className;
    delete newProps.draggable;
    return <img src={props.src} alt={props.alt} className={`object-cover select-none ${props.className}`} draggable={props.draggable || false} {...newProps} />;
};

export default Img;
