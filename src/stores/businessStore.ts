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
}

interface BusinessState {
    businesses: Business[];
    fetchBusinesses: () => Promise<Business[]>; // ✅ Artık return tipi doğru
}

export const useBusinessStore = create<BusinessState>((set) => ({
    businesses: [],
    fetchBusinesses: async (): Promise<Business[]> => {
        const rawData = await businessService.getAllBusinesses();

        const formatted: Business[] = rawData.map((item: any) => ({
            businessId: item.businessid,
            businessName: item.businessname,
            city: item.city,
            town: item.town,
            adressline1: item.adressline1,
            image_url: item.signed_url || item.image_url || 'https://cdn-icons-png.flaticon.com/512/2920/2920068.png',
        }));

        set({ businesses: formatted }); // ✅ Artık "never" hatası almazsın
        return formatted;
    },
}));