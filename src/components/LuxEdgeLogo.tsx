import React from 'react';
import Highlight from './Highlight';

interface Props {
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    lighter?: boolean;
    monochrome?: boolean;
    monochromeRev?: boolean;
}

const LuxEdge: React.FC<Props> = ({ className = '', id, style, lighter = false, monochrome = false, monochromeRev = false }: Props) =>
    monochrome ? (
        <span id={id} style={style} className={`tracking-tighter font-extrabold text-slate-100 ${className}`}>
            Lux
            <span className='text-gray-900'>Edge</span>
        </span>
    ) : monochromeRev ? (
        <span id={id} style={style} className={`tracking-tighter font-extrabold text-gray-900 ${className}`}>
            Lux
            <span className='text-slate-100'>Edge</span>
        </span>
    ) : (
        <span id={id} style={style} className={`tracking-tighter font-extrabold ${className}`}>
            Lux
            <Highlight effect={true} lighter={lighter}>
                Edge
            </Highlight>
        </span>
    );

export default LuxEdge;
