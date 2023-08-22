import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
