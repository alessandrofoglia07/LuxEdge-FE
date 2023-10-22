import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { NotificationMessage } from '@/types';

interface Props {
    /** Message to show in the notification. */
    message: NotificationMessage;
    /** Type of notification. */
    severity?: 'success' | 'error';
    /** Whether the notification is open or not. */
    open: boolean;
    /** Function to close the notification. */
    onClose: () => void;
}

const Notification: React.FC<Props> = ({ message, severity = 'success', open, onClose }: Props) => {
    const [messageState, setMessageState] = useState<NotificationMessage>(message);

    useEffect(() => {
        if (messageState.content === message.content) return;

        const letterRegex = /[a-z]/i;

        if (letterRegex.test(message.content.slice(-1))) {
            setMessageState({ ...message, content: message.content + '.' });
        } else {
            setMessageState({ ...message });
        }
    }, [message]);

    return (
        <div
            id='Notification'
            className={`fixed md:w-[36rem] w-[calc(100vw-8rem)] h-max bottom-6 right-6 rounded-lg elevate p-4 z-50
                bg-gradient-to-bl bg-white
                flex items-center justify-between gap-8
                ${open ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'} transition-[transform] duration-100 ease-in-out`}
        >
            <div className='flex flex-col gap-2'>
                <h2 className='text-2xl font-extrabold tracking-tight'>{messageState.title}</h2>
                <p className={`text-md ${severity === 'error' ? 'text-red-800' : 'text-black'} font-semibold hyphens-auto`}>{messageState.content}</p>
            </div>
            <button onClick={onClose} className='w-12 h-12 aspect-square hover:bg-slate-200 rounded-md grid place-items-center mr-4'>
                <XMarkIcon className='w-10 h-10 text-black' />
            </button>
        </div>
    );
};

export default Notification;
