import { API_URL } from '@/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getMyFavourites = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    console.log('📌 accessToken:', token);
    const res = await fetch(`${API_URL}/favourites`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Favoriler alınamadı');
    }

    return await res.json();
};

export const addToFavourites = async (businessId: string) => {
    const token = await AsyncStorage.getItem('accessToken');
    const res = await fetch(`${API_URL}/favourites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ businessId }),
    });

    if (!res.ok) {
        throw new Error('Favori ekleme başarısız');
    }

    return await res.json();
};

export const removeFromFavourites = async (businessId: string) => {
    const token = await AsyncStorage.getItem('accessToken');
    const res = await fetch(`${API_URL}/favourites/${businessId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Favoriden kaldırma başarısız');
    }

    return true;
};