import authAxios from '@/api/authAxios';

const getFavsList = async () => {
    try {
        const res = await authAxios.get('/lists/favorites/ids');
        return (res.data as string[]) || [];
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
