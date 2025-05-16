// src/services/businessService.ts
import { API_URL } from '@/config/config';

export const getAllBusinesses = async () => {
    const response = await fetch(`${API_URL}/businesses`);
    const json = await response.json();
    return json;
};  