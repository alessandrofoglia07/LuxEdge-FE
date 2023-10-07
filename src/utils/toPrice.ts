const toPrice = (price: number) => {
    if (Number.isInteger(price) && price > 0) {
        return `$ ${price}.00`;
    } else if (price > 0) {
        return `$ ${price.toFixed(2)}`;
    } else {
        return `$ 0.00`;
    }
};

export default toPrice;
