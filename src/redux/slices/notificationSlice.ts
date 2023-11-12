import { createSlice } from '@reduxjs/toolkit';
import { Notification, NotificationMessage } from '@/types';

const initialState: Notification[] = [];

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: { payload: NotificationMessage; type: string }) => {
            state.push({ id: Date.now(), ...action.payload });
        },
        removeNotification: (state, action: { payload: Notification; type: string }) => {
            const index = state.indexOf(action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
        removeNotificationByIndex: (state, action: { payload: number; type: string }) => {
            const index = state.findIndex((notification) => notification.id === action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        }
    }
});

export const { addNotification, removeNotification, removeNotificationByIndex } = notificationSlice.actions;

export default notificationSlice.reducer;
