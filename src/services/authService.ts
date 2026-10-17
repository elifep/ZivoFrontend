// src/services/authService.ts
import { API_URL } from '@/config/config';

export const loginUser = async (email: string, password: string) => {
    console.log(`${API_URL}/auth/login`)
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Giriş başarısız.');
    }

    return await response.json(); // { accessToken, refreshToken, user }
};

export const registerUser = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: 'user' }), // 👈 ekledik
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Kayıt başarısız.');
    }

    return await response.json(); // { accessToken, refreshToken, user }
};

export const refreshToken = async (refreshToken: string) => {
    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
    });

    if (!response.ok) {
        throw new Error('Token yenileme başarısız.');
    }

    return await response.json();
};