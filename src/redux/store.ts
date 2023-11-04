import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        notifications: notificationReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
