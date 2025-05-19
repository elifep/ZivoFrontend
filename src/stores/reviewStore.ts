import { create } from 'zustand';
import {
    getReviewsByBusiness,
    getAverageRatingByBusiness,
    createReview,
    updateReview,
    deleteReview,
    getAverageByBusinessId
} from '@/services/reviewService';

interface Review {
    reviewsId: string;
    businessId: string;
    userId: string;
    rating: number;
    comment: string | null;
    created_at?: string;
    user?: {
        full_name: string;
        image_url: string;
    };
}

interface ReviewStore {
    reviews: Review[];
    average: number;
    total: number;
    loading: boolean;
    fetchReviews: (businessId: string) => Promise<void>;
    addReview: (token: string, businessId: string, rating: number, comment: string) => Promise<void>;
    editReview: (token: string, reviewId: string, rating: number, comment: string) => Promise<void>;
    removeReview: (token: string, reviewId: string) => Promise<void>;
    fetchAverageByBusinessId: (businessId: string) => Promise<{ average: number, total: number }>;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
    reviews: [],
    average: 0,
    total: 0,
    loading: false,

    fetchReviews: async (businessId: string) => {
        set({ loading: true });
        try {
            const reviews = await getReviewsByBusiness(businessId);
            const averageInfo = await getAverageRatingByBusiness(businessId);
            set({
                reviews,
                average: averageInfo.averageRating,
                total: averageInfo.totalReviews
            });
        } catch (err) {
            console.error('Review fetch failed:', err);
        } finally {
            set({ loading: false });
        }
    },

    addReview: async (token, businessId, rating, comment) => {
        const review = await createReview(token, businessId, rating, comment);
        set((state) => ({
            reviews: [review, ...state.reviews],
            total: state.total + 1
        }));
    },

    editReview: async (token, reviewId, rating, comment) => {
        const updated = await updateReview(token, reviewId, rating, comment);
        set((state) => ({
            reviews: state.reviews.map((r) => (r.reviewsId === reviewId ? updated : r))
        }));
    },

    removeReview: async (token, reviewId) => {
        await deleteReview(token, reviewId);
        set((state) => ({
            reviews: state.reviews.filter((r) => r.reviewsId !== reviewId),
            total: state.total - 1
        }));
    },
    fetchAverageByBusinessId: async (businessId: string) => {
        try {
            const data = await getAverageByBusinessId(businessId); // bu zaten { average, total } dönüyor
            return data;
        } catch (error) {
            console.error('⭐ Ortalama puan hatası:', error);
            return {
                average: 0,
                total: 0
            };
        }
    },
}));