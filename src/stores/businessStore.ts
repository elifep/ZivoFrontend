// src/stores/businessStore.ts
import { create } from 'zustand';
import * as businessService from '@/services/businessService';

interface Business {
    businessId: string;
    businessName: string;
    city: string;
    town: string;
    adressline1: string;
    image_url: string;
    signed_url?: string;
    latitude: number;
    longitude: number;
}
interface BusinessState {
    businesses: Business[];
    selectedBusiness?: Business;
    fetchBusinesses: () => Promise<Business[]>;
    fetchNearbyBusinesses: (lat: number, lng: number, radius?: number) => Promise<Business[]>;
    fetchTopRatedBusinesses: () => Promise<Business[]>;
    fetchMostBookedBusinesses: () => Promise<Business[]>;
    fetchFilteredBusinesses: (params: Record<string, any>) => Promise<Business[]>;
    setSelectedBusiness: (business: Business) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
    businesses: [],
    selectedBusiness: undefined,

    fetchBusinesses: async () => {
        const rawData = await businessService.getAllBusinesses();
        const formatted = formatBusinessList(rawData);
        set({ businesses: formatted });
        return formatted;
    },

    fetchNearbyBusinesses: async (lat, lng, radius = 5) => {
        const rawData = await businessService.getNearbyBusinesses(lat, lng, radius);
        const formatted = formatBusinessList(rawData);
        set({ businesses: formatted });
        return formatted;
    },

    fetchTopRatedBusinesses: async () => {
        const rawData = await businessService.getTopRatedBusinesses();
        const formatted = formatBusinessList(rawData);
        set({ businesses: formatted });
        return formatted;
    },

    fetchMostBookedBusinesses: async () => {
        const rawData = await businessService.getMostBookedBusinesses();
        const formatted = formatBusinessList(rawData);
        set({ businesses: formatted });
        return formatted;
    },

    fetchFilteredBusinesses: async (params) => {
        const rawData = await businessService.getFilteredBusinesses(params);
        const formatted = formatBusinessList(rawData);
        set({ businesses: formatted });
        return formatted;
    },

    setSelectedBusiness: (business) => set({ selectedBusiness: business }),
}));

const formatBusinessList = (data: any[]): Business[] => {
    return data.map((item: any) => ({
        businessId: item.businessid,
        businessName: item.businessname,
        city: item.city,
        town: item.town,
        adressline1: item.adressline1,
        image_url: item.signed_url || item.image_url,
        latitude: item.latitude,
        longitude: item.longitude
    }));
};