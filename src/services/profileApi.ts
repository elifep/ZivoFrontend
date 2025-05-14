import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/config/config';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export type ProfileFormValues = {
    full_name: string;
    phone: string;
    birthday: string;
    gender: string;
    address: string;
    image?: { uri: string; fileSize?: number; mimeType?: string };
};

export const getMyProfile = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Yetki bilgisi bulunamadı.');

    const response = await fetch(`${API_URL}/profiles/me`, {
        method: 'GET',
        headers: {
           'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error('Profil bilgisi getirilemedi.');

    return response.json();
};

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
        const { uri, fileSize, mimeType } = data.image;

        const MAX_SIZE = 2 * 1024 * 1024;
        if (fileSize !== undefined && fileSize > MAX_SIZE) {
            throw new Error('Dosya boyutu 2MB’dan büyük olamaz.');
        }

        const filename = uri.split('/').pop() || 'profile.jpg';
        const newPath = FileSystem.cacheDirectory + filename;

        await FileSystem.copyAsync({ from: uri, to: newPath });

        formData.append('image', {
            uri: Platform.OS === 'android' ? newPath : newPath.replace('file://', ''),
            name: filename,
            type: mimeType || 'image/jpeg',
        } as any);
    }

    const response = await fetch(`${API_URL}/profiles/me`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            // Content-Type kesinlikle eklenmiyor!
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sunucu hatası: ${response.status} - ${errorText}`);
    }

    return await response.json();
};