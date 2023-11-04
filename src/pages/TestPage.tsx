import React from 'react';
import NotificationsMenu from '@/components/NotificationsMenu';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/slices/notificationSlice';

const TestPage: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <div id='TestPage'>
            <h1>TestPage</h1>
            <NotificationsMenu />
            {Array.from({ length: 5 }).map((_, i) => (
                <button
                    key={i}
                    className='border-4 border-black p-3'
                    onClick={() => {
                        dispatch(addNotification({ title: `Test ${i}`, content: 'This is a test notification.' }));
                    }}
                >
                    Add notification {i}
                </button>
            ))}
        </div>
    );
};

export default TestPage;
