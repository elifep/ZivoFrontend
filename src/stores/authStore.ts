// src/stores/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    logout: () => Promise<void>;
    loadTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,

    login: async (email, password) => {
        const data = await authService.loginUser(email.trim(), password.trim());
        set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });

        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        set({
            user: data.user ?? null,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });

        if (data.user) {
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
        }
    },

    register: async (email, password) => {
        const data = await authService.registerUser(email.trim(), password.trim());
        const user = { email, role: 'user' };
        set({
            user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        });

        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        await AsyncStorage.setItem('user', JSON.stringify(user));
    },

    logout: async () => {
        set({ user: null, accessToken: null, refreshToken: null });
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    },

    loadTokens: async () => {
        const [accessToken, refreshToken, user] = await Promise.all([
            AsyncStorage.getItem('accessToken'),
            AsyncStorage.getItem('refreshToken'),
            AsyncStorage.getItem('user'),
        ]);

        set({
            accessToken,
            refreshToken,
            user: user ? JSON.parse(user) : null,
        });
    },
}));