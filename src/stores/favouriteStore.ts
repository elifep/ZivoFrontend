import { create } from 'zustand';
import { getMyFavourites, addToFavourites, removeFromFavourites } from '@/services/favouriteService';
import Toast from 'react-native-toast-message';

interface Favourite {
    favouriteId: string;
    userId: string;
    businessid: string;
}
interface FavouriteStore {
    favourites: Favourite[];
    isLoadingFavourites: boolean;
    fetchFavourites: () => Promise<void>;
    toggleFavourite: (businessId: string) => Promise<void>;
    isFavourited: (businessId: string) => boolean;
}

export const useFavouriteStore = create<FavouriteStore>((set, get) => ({
    favourites: [],
    isLoadingFavourites: true,

    fetchFavourites: async () => {
        try {
            set({ isLoadingFavourites: true });
            const data = await getMyFavourites();
            set({ favourites: data, isLoadingFavourites: false });
        } catch (err) {
            console.error('Favoriler alınırken hata:', err);
            set({ isLoadingFavourites: false });
        }
    },

    toggleFavourite: async (businessId: string) => {
        const { favourites } = get();
        const alreadyFav = favourites.find((fav) => fav.businessid === businessId);

        try {
            if (alreadyFav) {
                await removeFromFavourites(businessId);
                set({
                    favourites: favourites.filter((fav) => fav.businessid !== businessId),
                });
                Toast.show({
                    type: 'success',
                    text1: 'Removed from favorites',
                    position: 'top',
                });
            } else {
                const newFav = await addToFavourites(businessId);
                set({ favourites: [...favourites, newFav] });
                Toast.show({
                    type: 'success',
                    text1: 'Added to favorites',
                    position: 'top',
                });
            }
        } catch (err) {
            console.error('Favori güncellenemedi:', err);
            Toast.show({
                type: 'error',
                text1: 'An error occurred',
                text2: 'Failed to update favorite',
                position: 'top',
            });
        }
    },

    isFavourited: (businessId: string) => {
        const { favourites } = get();
        return favourites.some((fav) => fav.businessid === businessId);
    },
}));  