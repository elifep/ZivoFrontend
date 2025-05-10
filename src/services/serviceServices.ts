import { API_URL } from '@/config/config';

export const getServicesByBusinessId = async (businessId: string) => {
    const response = await fetch(`${API_URL}/services/business/${businessId}`);
    if (!response.ok) {
        throw new Error('Hizmetler getirilemedi');
    }
    return response.json();
};