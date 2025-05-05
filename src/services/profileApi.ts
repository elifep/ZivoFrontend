// src/services/profileApi.ts

export interface ProfileFormValues {
    full_name: string;
    phone: string;
    birthday: string;
    gender: string;
    address: string;
    image?: File;
}

export const updateMyProfile = async (data: ProfileFormValues, token: string) => {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('phone', data.phone);
    formData.append('birthday', data.birthday);
    formData.append('gender', data.gender);
    formData.append('address', data.address);
    if (data.image) {
        formData.append('image', data.image);
    }

    const response = await fetch('http://localhost:5000/profiles/me', {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Profile update failed.');
    }

    return await response.json();
};

export const getMyProfile = async (token: string) => {
    const response = await fetch('http://localhost:5000/profiles/me', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile.');
    }

    return await response.json();
};  