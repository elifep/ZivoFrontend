import { API_URL } from '@/config/config';

export const getReviewsByBusiness = async (businessId: string) => {
    const res = await fetch(`${API_URL}/reviews/business/${businessId}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return await res.json();
};

export const getAverageRatingByBusiness = async (businessId: string) => {
    const res = await fetch(`${API_URL}/reviews/business/${businessId}/average`);
    if (!res.ok) throw new Error('Failed to fetch average rating');
    return await res.json();
};

export const createReview = async (
    token: string,
    businessId: string,
    rating: number,
    comment: string
) => {
    const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ businessId, rating, comment })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create review');
    }

    return await res.json();
};

export const updateReview = async (
    token: string,
    reviewId: string,
    rating: number,
    comment: string
) => {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update review');
    }

    return await res.json();
};

export const deleteReview = async (token: string, reviewId: string) => {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete review');
    }
};
export const getAverageByBusinessId = async (businessId: string) => {
    const response = await fetch(`${API_URL}/reviews/business/${businessId}/average`);
    if (!response.ok) throw new Error('Ortalama veri alınamadı');
    const data = await response.json();

    return {
        average: data.averageRating || 0, // ⚠️ average değil averageRating
        total: data.totalReviews || 0,
    };
};