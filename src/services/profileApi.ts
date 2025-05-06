// src/services/profileApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/src/config/config';

const BASE_URL = API_URL;

export interface ProfileFormValues {
    full_name: string;
    phone: string;
    birthday: string;
    gender: string;
    address: string;
    image?: File;
}

export const updateMyProfile = async (data: ProfileFormValues) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Yetki bilgisi bulunamadı.');

    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('phone', data.phone);
    formData.append('birthday', data.birthday);
    formData.append('gender', data.gender);
    formData.append('address', data.address);
    if (data.image) {
        formData.append('image', data.image);
    }

    const response = await fetch(`${BASE_URL}/profiles/me`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Profile update failed.');
    }

    return await response.json();
};

export const getMyProfile = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Yetki bilgisi bulunamadı.');

    const response = await fetch(`${BASE_URL}/profiles/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile.');
    }

    return await response.json();
};