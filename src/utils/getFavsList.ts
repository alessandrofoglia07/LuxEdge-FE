import authAxios from '@/api/authAxios';
import { Product } from '@/types';

const getFavsList = async () => {
    try {
        const res = await authAxios.get('/lists/favorites');
        return (res.data as Product[]) || [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw err;
        } else if (typeof err === 'string') {
            throw new Error(err);
        } else {
            console.log(err);
        }
    }
};

export default getFavsList;
