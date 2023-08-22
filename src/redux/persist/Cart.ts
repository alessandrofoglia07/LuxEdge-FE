/** Cart is array of products' ids (located in localStorage) */
class Cart {
    /** Get cart from localStorage */
    public static get(): string[] {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    /** Add product to cart
     * @param productId id of product to add
     * @returns new cart
     */
    public static add(productId: string) {
        const cart = this.get();
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    }

    /** Remove product from cart
     * @param productId id of product to remove
     * @returns new cart
     */
    public static remove(productId: string) {
        const cart = this.get();
        const index = cart.indexOf(productId);
        if (index !== -1) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    }

    /** Clear cart */
    public static clear() {
        localStorage.removeItem('cart');
    }
}

export default Cart;
