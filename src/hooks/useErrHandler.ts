import { isAxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '@/redux/slices/notificationSlice';
import { NotificationMessage } from '@/types';

type HandleErrType = (err: unknown, defaultMsg?: string) => string;

/**
 * Custom hook for handling errors
 */
const useErrHandler = (): HandleErrType => {
    const dispatch = useDispatch();

    /**
     * Handle error logging, adds notification and return error message
     * @param err - error
     * @returns error message as string
     */
    const handleErr: HandleErrType = (err, defaultMsg) => {
        let msg = defaultMsg ?? 'Something went wrong';

        if (isAxiosError(err)) {
            if (err.response) {
                msg = err.response.data;
            } else if (err.request) {
                msg = err.request.response || err.request.statusText || err.request.status || '';
            } else {
                msg = err.message;
            }
        } else if (err instanceof Error) {
            msg = err.message;
        } else if (typeof err === 'string') {
            msg = err;
        }

        const notification: NotificationMessage = {
            content: msg,
            title: 'Unexpected error occurred',
            severity: 'error'
        };

        dispatch(addNotification(notification));

        return msg;
    };

    return handleErr;
};

export default useErrHandler;
