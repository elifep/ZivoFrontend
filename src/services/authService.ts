// src/services/authService.ts

export const loginUser = async (email: string, password: string) => {
    const response = await fetch('http://localhost:5000/auth/login', {
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
    const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Kayıt başarısız.');
    }

    return await response.json();
};

export const refreshToken = async (refreshToken: string) => {
    const response = await fetch('http://localhost:5000/auth/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
    });

    if (!response.ok) {
        throw new Error('Token yenileme başarısız.');
    }

    return await response.json(); // { accessToken: "...", ... }
};  