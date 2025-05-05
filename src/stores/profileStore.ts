// src/stores/profileStore.ts
import { create } from 'zustand';
import { getMyProfile, updateMyProfile, ProfileFormValues } from '../services/profileApi';

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
    fetchProfile: (token: string) => Promise<void>;
    updateProfile: (data: ProfileFormValues, token: string) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,

    fetchProfile: async (token) => {
        const profile = await getMyProfile(token);
        set({ profile });
    },

    updateProfile: async (data, token) => {
        const updated = await updateMyProfile(data, token);
        set({ profile: updated });
    },
}));
