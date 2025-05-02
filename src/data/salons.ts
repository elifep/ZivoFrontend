//data/salons.ts
export const campaignSalons = [
    {
        id: '1',
        name: 'Rose Life Nişantaşı',
        address: '34920 Vadi İstanbul Avrupa Yakası',
        rating: 5.0,
        liked: true,
        discount: '10%',
        mostLiked: true, // 👈 bu eklendi
        category: 'Saç Hizmetleri',
        image: require('@/assets/images/salons/rose-life-nisantasi.jpg'),
    },
    {
        id: '2',
        name: 'Blink Saasy',
        address: 'İstanbul Anadolu Yakası petrol yolu caddesi metehan sokak',
        rating: 4.8,
        liked: true,
        discount: '15%',
        mostLiked: false,
        category: 'Saç Hizmetleri',
        image: require('@/assets/images/salons/blink-saasy.jpg'),
    },
    {
        id: '3',
        name: 'elif salon',
        address: 'İstanbul avrupa Yakasi petrol yolu caddesi metehan sokak',
        rating: 4.7,
        liked: false,
        discount: '10%',
        mostLiked: true,
        category: 'Cilt Bakımı',
        image: require('@/assets/images/salons/cilt.jpg'),
    },
];

export const allSalons = [
    ...campaignSalons,
    {
        id: '4',
        name: 'X Güzellik Salonu',
        address: '34920 MacArthur İstanbul',
        rating: 5.0,
        liked: false,
        category: 'Tırnak Hizmetleri',
        image: require('@/assets/images/salons/x-guzellik-salonu.jpg'),
    },
];  