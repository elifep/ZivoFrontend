// src/services/businessService.ts
import { API_URL } from '@/config/config';

export const getAllBusinesses = async () => {
    console.log('getAllBusinesses çağrıldı');
    const response = await fetch(`${API_URL}/business`);
    console.log('Response status:', response.status);
    const json = await response.json();
    console.log('JSON:', json);
    return json;
};  