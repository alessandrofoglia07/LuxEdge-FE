import { useState, useEffect } from 'react';

/** useWindowsWidth custom hook
 * @returns width
 */
const useWindowWidth = (): number => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', () => setWidth(window.innerWidth));
        return window.removeEventListener('resize', () => setWidth(window.innerWidth));
    }, []);

    return width;
};

export default useWindowWidth;
