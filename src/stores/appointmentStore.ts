import { create } from 'zustand';
import { getUserAppointments, cancelAppointment, createAppointment } from '@/services/appointmentApi';

interface Appointment {
    appointmentid: string;
    userid: string;
    businessid: string;
    servicesid: string | null;
    staffid: string | null;
    appointment_time: string;
    status: 'active' | 'cancelled';
}

interface AppointmentStore {
    appointments: Appointment[];
    loading: boolean;
    error: string | null;
    fetchAppointments: () => Promise<void>;
    cancel: (id: string) => Promise<void>;
    create: (args: any) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
    appointments: [],
    loading: false,
    error: null,

    fetchAppointments: async () => {
        console.log('📡 fetchAppointments çağrıldı');
        set({ loading: true, error: null });
        try {
            const data = await getUserAppointments();
            console.log('✅ API yanıtı:', data);
            const mapped = data.map((item: any) => ({
                ...item,
                status: item.status as 'active' | 'cancelled',
            }));
            set({ appointments: mapped });
        } catch (error: any) {
            console.error('❌ Randevu çekme hatası:', error.message);
            set({ error: error.message || 'Bir hata oluştu' });
        } finally {
            set({ loading: false });
        }
    },

    cancel: async (id: string) => {
        try {
            await cancelAppointment(id);
            const updated = get().appointments.map((a) =>
                a.appointmentid === id ? { ...a, status: 'cancelled' as 'cancelled' } : a
            );
            set({ appointments: updated });
        } catch (err: any) {
            console.error('İptal başarısız:', err.message);
        }
    },
    create: async ({
        businessId,
        servicesId,
        staffId,
        appointment_time
    }: {
        businessId: string;
        servicesId: string;
        staffId: string | null;
        appointment_time: string;
    }) => {
        try {
            const newAppointment = await createAppointment(businessId, servicesId, staffId, appointment_time);
            set({ appointments: [...get().appointments, newAppointment] });
        } catch (error: any) {
            console.error('Randevu oluşturma hatası:', error.message);
            throw error;
        }
    }
}));