// src/stores/profileStore.ts
import { create } from 'zustand';
import { getMyProfile, updateMyProfile, ProfileFormValues } from '@/src/services/profileApi';

interface Profile {
    profileId: string;
    userId: string;
    phone: string | null;
    birthday: string | null;
    gender: string | null;
    address: string | null;
    full_name: string | null;
    image_url: string | null;
}

interface ProfileStore {
    profile: Profile | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: ProfileFormValues) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,

    fetchProfile: async () => {
        const profile = await getMyProfile();
        set({ profile });
    },

    updateProfile: async (data) => {
        const updated = await updateMyProfile(data);
        set({ profile: updated });
    },
}));