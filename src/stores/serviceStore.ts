import { create } from 'zustand';
import { API_URL } from '@/config/config';

// Interface doğrudan burada tanımlandı
interface Service {
    servicesid: string;
    businessid: string;
    staffid?: string;
    name: string;
    description?: string;
    price?: number;
    duration_min?: number;
}

interface ServiceStore {
    services: Service[];
    loading: boolean;
    error: string | null;
    fetchServices: (businessId: string) => Promise<void>;
    fetchAllServices: () => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set) => ({
    services: [],
    loading: false,
    error: null,

    fetchAllServices: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/services`);
          if (!response.ok) throw new Error('Tüm hizmetler getirilemedi');
          const data = await response.json();
          set({ services: data, loading: false });
        } catch (error: any) {
          set({ error: error.message || 'Bir hata oluştu', loading: false });
        }
      },
      
    fetchServices: async (businessId: string) => {
        if (!businessId) return; // boş id ile fetch etme
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${API_URL}/services/business/${businessId}`);
            if (!response.ok) throw new Error('Hizmetler getirilemedi');

            const data = await response.json();
            set({ services: data, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Bir hata oluştu', loading: false });
        }
    },
}));