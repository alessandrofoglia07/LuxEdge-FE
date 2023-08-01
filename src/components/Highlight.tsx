import React, { useState, useEffect } from 'react';

const Highlight = ({ children, lighter = false, force }: { children: React.ReactNode; lighter?: boolean; force?: boolean }) => {
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

    return (
        <span
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            className={`${lighter ? `${hover ? 'text-primary-base' : 'text-primary-light'}` : `${hover ? 'text-primary-hover' : 'text-primary-base'}`}`}>
            {children}
        </span>
    );
};

export default Highlight;
