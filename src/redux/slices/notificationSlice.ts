import { createSlice } from '@reduxjs/toolkit';
import { Notification } from '@/types';

const initialState: Notification[] = [];

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.push({ id: Date.now(), ...action.payload });
        },
        removeNotification: (state, action) => {
            const index = state.indexOf(action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        removeNotificationByIndex: (state, action) => {
            const index = state.findIndex((notification) => notification.id === action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        }
    }
});

export const { addNotification, removeNotification, removeNotificationByIndex } = notificationSlice.actions;

export default notificationSlice.reducer;
