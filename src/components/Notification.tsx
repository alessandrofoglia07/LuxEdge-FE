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
            className='elevate fixed -bottom-28 right-6 z-50 flex h-max w-[calc(100vw-8rem)] items-center justify-between gap-8 rounded-2xl bg-white bg-gradient-to-bl px-6 py-6 transition-transform duration-100 ease-in-out md:w-fit md:max-w-[36rem]'>
            <div className='flex flex-col gap-2'>
                <h2 className='flex items-center gap-3 text-lg font-medium leading-6 text-gray-900 [&>svg]:h-6 [&>svg]:w-6'>
                    {messageState.icon}
                    {' ' + messageState.title}
                </h2>
                <p className={`text-sm ${severity === 'error' ? 'text-red-800' : 'text-gray-500'} flex items-center hyphens-auto`}>{messageState.content}</p>
            </div>
            <button onClick={onClose} className='mr-4 grid aspect-square h-12 w-12 place-items-center rounded-lg hover:bg-slate-200'>
                <XMarkIcon className='h-8 w-8 text-black' />
            </button>
        </div>
    );
};

export default Notification;
