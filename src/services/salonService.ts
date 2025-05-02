import { allSalons, campaignSalons } from '@/src/data/salons';

export const getCampaignSalons = async () => {
    return campaignSalons;
};

export const getAllSalons = async (category?: string) => {
    if (category && category !== 'Hepsi') {
        return allSalons.filter((s) => s.category === category);
    }
    return allSalons;
};