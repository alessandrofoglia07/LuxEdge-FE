import React, { useState, useEffect } from 'react';

interface Props {
    children: React.ReactNode;
    lighter?: boolean;
    force?: boolean;
    effect?: boolean;
}

const Highlight: React.FC<Props> = ({ children, lighter = false, force, effect = false }: Props) => {
    const [hover, setHover] = useState<boolean>(false);

    useEffect(() => {
        if (force) {
            setHover(true);
        } else {
            setHover(false);
        }
    }, [force]);

    const handleHover = () => {
        if (!force) {
            setHover(true);
        }
    };

    const handleLeave = () => {
        if (!force) {
            setHover(false);
        }
    };

    let className: string;

    if (effect) {
        if (lighter) {
            if (hover) {
                // lighter hover
                className = 'text-primary-base';
            } else {
                // lighter base
                className = 'text-primary-light';
            }
        } else {
            if (hover) {
                // normal hover
                className = 'text-primary-hover';
            } else {
                // normal base
                className = 'text-primary-base';
            }
        }
    } else {
        if (lighter) {
            // lighter base
            className = 'text-primary-light';
        } else {
            // normal base
            className = 'text-primary-base';
        }
    }

    return (
        <span onMouseEnter={handleHover} onMouseLeave={handleLeave} className={className}>
            {children}
        </span>
    );
};

export default Highlight;
