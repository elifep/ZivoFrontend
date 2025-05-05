import { create } from 'zustand';
import * as authService from '@/src/services/authService';

interface User {
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
    refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,

    login: async (email, password) => {
        const data = await authService.loginUser(email, password);
        set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
    },

    register: async (email, password) => {
        const data = await authService.registerUser(email, password);
        set({
            user: { email, role: 'user' },
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
    },

    logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },
}));