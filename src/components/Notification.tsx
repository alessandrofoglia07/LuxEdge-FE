import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface Props {
    /** Message to show in the notification. */
    message: string;
    /** Type of notification. */
    severity?: 'success' | 'error';
    /** Whether the notification is open or not. */
    open: boolean;
    /** Function to close the notification. */
    onClose: () => void;
}

const Notification: React.FC<Props> = ({ message, severity = 'success', open, onClose }: Props) => {
    const [messageState, setMessageState] = useState('');

    useEffect(() => {
        if (messageState === message) return;

        const letterRegex = /[a-zA-Z]/;

        if (letterRegex.test(message.slice(-1))) {
            setMessageState(message + '.');
        }
    }, [message]);

    return (
        <div
            id='Notification'
            className={`fixed w-96 h-max bottom-6 right-6 rounded-lg shadow-lg p-4 z-50
                bg-gradient-to-bl ${severity === 'error' ? 'from-red-500 to-red-700' : 'from-blue-500 to-blue-700'}
                flex items-center justify-between gap-4
                ${open ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'} transition-[transform] duration-100 ease-in-out`}>
            <p className='text-lg text-white font-semibold'>{messageState}</p>
            <button onClick={onClose} className='w-10 h-10 hover:bg-white hover:bg-opacity-20 rounded-md grid place-items-center'>
                <XMarkIcon className='w-8 h-8 text-white' />
            </button>
        </div>
    );
};

export default Notification;
