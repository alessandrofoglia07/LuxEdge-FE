import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { NotificationMessage } from '@/types';

interface Props {
    /** Message to show in the notification. */
    message: NotificationMessage;
    /** Type of notification. */
    severity?: 'success' | 'error';
    /** Function to close the notification. */
    onClose: () => void;
    /** Custom ID for the notification */
    id?: string;
}

const Notification: React.FC<Props> = ({ message, severity = 'success', onClose, id }: Props) => {
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
            id={id ? id : 'Notification'}
            className='fixed md:max-w-[36rem] md:w-fit w-[calc(100vw-8rem)] h-max right-6 rounded-2xl elevate py-6 px-6 z-50 bg-gradient-to-bl bg-white flex items-center justify-between gap-8 transition-transform duration-100 ease-in-out -bottom-28'
        >
            <div className='flex flex-col gap-2'>
                <h2 className='text-lg font-medium leading-6 text-gray-900'>{messageState.title}</h2>
                <p className={`text-sm ${severity === 'error' ? 'text-red-800' : 'text-gray-500'} hyphens-auto`}>{messageState.content}</p>
            </div>
            <button onClick={onClose} className='w-12 h-12 aspect-square hover:bg-slate-200 rounded-lg grid place-items-center mr-4'>
                <XMarkIcon className='w-8 h-8 text-black' />
            </button>
        </div>
    );
};

export default Notification;
