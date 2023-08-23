import { RootState } from '@/redux/store';
import { useSelector as useSelectorRedux, TypedUseSelectorHook } from 'react-redux';

/** Typed `useSelector` hook */
const useSelector: TypedUseSelectorHook<RootState> = useSelectorRedux;

export default useSelector;
