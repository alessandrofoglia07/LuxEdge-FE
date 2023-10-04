import authAxios from '@/api/authAxios';

class Favorites {
    /** Get favorites list */
    public static get(): string[] {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    /** Set favorites list */
    public static set(favorites: string[]) {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        if (favorites.length === 0) {
            localStorage.removeItem('favorites');
        }
    }

    /** Add product to favorite state in localstorage  */
    public static add(id: string) {
        const favorites = this.get();
        favorites.push(id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        return favorites;
    }

    /** Remove product from favorite state in localstorage */
    public static remove(id: string) {
        const favorites = this.get();
        const index = favorites.findIndex((favId: string) => favId === id);
        if (index !== -1) {
            favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        if (this.get().length === 0) {
            localStorage.removeItem('favorites');
        }
        return favorites;
    }

    /** Clear favorite state in localstorage */
    public static clear() {
        localStorage.removeItem('favorites');
    }

    /** Sync localstorage with db */
    public static async sync() {
        const res = await authAxios.patch('/lists/favorites/add-multiple', {
            ids: this.get()
        });

        this.set(res.data);
    }
}

export default Favorites;
