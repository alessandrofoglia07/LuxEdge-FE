import React from 'react';
import Highlight from './Highlight';

interface Props {
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    version?: 'standard' | 'lighter' | 'white' | 'black';
}

const LuxEdge: React.FC<Props> = ({ className = '', id, style, version = 'standard' }: Props) =>
    version === 'white' ? (
        <span id={id} style={style} className={`tracking-tighter font-extrabold text-slate-100 ${className}`}>
            LuxEdge
        </span>
    ) : version === 'black' ? (
        <span id={id} style={style} className={`tracking-tighter font-extrabold text-gray-900 ${className}`}>
            LuxEdge
        </span>
    ) : (
        <span id={id} style={style} className={`tracking-tighter font-extrabold ${className}`}>
            Lux
            <Highlight effect={true} lighter={version === 'lighter'}>
                Edge
            </Highlight>
        </span>
    );

export default LuxEdge;
