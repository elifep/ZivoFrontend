import { API_URL } from '@/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserAppointments = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Yetki bilgisi bulunamadı.');
    console.log('🔐 Token:', token);
    const response = await fetch(`${API_URL}/appointments/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log('📡 Yanıt Kodu:', response.status);
    if (!response.ok) {
        throw new Error('Randevular getirilemedi');
    }

    const data = await response.json();
    return data.map((item: any) => ({
        ...item,
        status: item.status as 'active' | 'cancelled',
    }));
};

export const cancelAppointment = async (id: string) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Yetki bilgisi bulunamadı.');

    const response = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
    });
    if (!response.ok) {
        throw new Error('Randevu iptal edilemedi');
    }
};
export const createAppointment = async (
    businessId: string,
    servicesId: string,
    staffId: string | null,
    appointment_time: string
) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Yetki bilgisi bulunamadı.');

    const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            businessId,
            servicesId,
            staffId,
            appointment_time,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Randevu oluşturulamadı');
    }

    return await response.json();
};