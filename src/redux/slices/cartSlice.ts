import { createSlice } from '@reduxjs/toolkit';
import Cart from '@/redux/persist/Cart';

const initialState: string[] = Cart.get();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            Cart.add(action.payload);
            state.push(action.payload);
        },
        removeFromCart: (state, action) => {
            Cart.remove(action.payload);
            const index = state.indexOf(action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        clearCart: (state) => {
            Cart.clear();
            state.length = 0;
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
