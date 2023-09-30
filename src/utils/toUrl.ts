const toUrl = (path: string) => {
    return `${import.meta.env.VITE_API_URL}/products/${path}`;
};

export default toUrl;
