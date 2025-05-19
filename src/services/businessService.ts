import { API_URL } from '@/config/config';

export const getAllBusinesses = async () => {
    const response = await fetch(`${API_URL}/businesses`);
    return await response.json();
};

export const getNearbyBusinesses = async (lat: number, lng: number, radius = 5) => {
    const response = await fetch(`${API_URL}/businesses/search?lat=${lat}&lng=${lng}&radius=${radius}`);
    return await response.json();
};

export const getTopRatedBusinesses = async () => {
    const response = await fetch(`${API_URL}/businesses/top-rated`);
    return await response.json();
};

export const getMostBookedBusinesses = async () => {
    const response = await fetch(`${API_URL}/businesses/most-booked`);
    return await response.json();
};

export const getFilteredBusinesses = async (params: {
    lat?: number;
    lng?: number;
    radius?: number;
    city?: string;
    town?: string;
    query?: string;
    homeService?: boolean;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            query.append(key, String(value));
        }
    });

    const response = await fetch(`${API_URL}/businesses/search?${query.toString()}`);
    return await response.json();
};