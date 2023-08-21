import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

/** `useSelector` hook wrapper
 * @argument selector - name of the reducer
 * @returns state of the reducer
 * @example
 * const { accessToken } = useRedux('auth');
 * console.log(accessToken);
 * // output: '1234567890'
 */
const useRedux = (selector: keyof RootState) => {
    return useSelector((state: RootState) => state[selector]);
};

export default useRedux;
