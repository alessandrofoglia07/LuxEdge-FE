import authAxios from '@/api/authAxios';
import { isAxiosError } from 'axios';

const getFavsList = async () => {
    try {
        const res = await authAxios.get('/lists/favorites/ids');
        return (res.data as string[]) || [];
    } catch (err: unknown) {
        let msg = 'Something went wrong';

        if (isAxiosError(err)) {
            if (err.response) {
                msg = err.response.data;
            } else if (err.request) {
                msg = err.request;
            } else {
                msg = err.message;
            }
        } else if (err instanceof Error) {
            msg = err.message;
        } else if (typeof err === 'string') {
            msg = err;
        }
        console.log('Error', msg);
    }
};

export default getFavsList;
