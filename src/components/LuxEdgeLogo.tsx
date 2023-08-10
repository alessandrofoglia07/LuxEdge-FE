import React from 'react';
import Highlight from './Highlight';

interface Props {
    className?: string;
}

const LuxEdge: React.FC<Props> = ({ className = '' }: Props) => (
    <span className={`tracking-tighter font-extrabold ${className}`}>
        Lux<Highlight effect>Edge</Highlight>
    </span>
);

export default LuxEdge;
