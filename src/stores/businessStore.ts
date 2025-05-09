// src/stores/businessStore.ts
import { create } from 'zustand';
import * as businessService from '@/services/businessService';

interface Business {
    businessId: string;
    businessName: string;
    city: string;
    town: string;
    address: string;
    image_url: string;
}

interface BusinessState {
    businesses: Business[];
    fetchBusinesses: () => Promise<void>;
}

export const useBusinessStore = create<BusinessState>((set) => ({
    businesses: [],
    fetchBusinesses: async () => {
        const rawData = await businessService.getAllBusinesses();

        const formatted = rawData.map((item: any) => ({
            businessId: item.businessid,
            businessName: item.businessname,
            city: item.city,
            town: item.town,
            address: item.address,
            image_url: item.image_url || 'https://cdn-icons-png.flaticon.com/512/2920/2920068.png',
        }));

        set({ businesses: formatted });
    }
}));