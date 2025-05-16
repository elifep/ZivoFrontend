import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import SalonCard from '@/components/SalonCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllBusinesses } from '@/services/businessService';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const { colors, isDark } = useAppTheme();
    const { t } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        getAllBusinesses().then((data) => {
            const formatted = data.map((item: any) => ({
                businessId: item.businessid,
                businessName: item.businessname,
                adressline1: item.adressline1,
                image_url: item.image_url,
                liked: true,
            }));
            setFavorites(formatted);
        }).catch((err) => {
            console.log('Favori salonlar alınırken hata:', err);
        });
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                {t('favourites.title')}
            </Text>

            {favorites.length === 0 ? (
                <Text style={[styles.empty, { color: colors.icon }]}>
                    {t('favourites.empty')}
                </Text>
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    {favorites.map((item) => (
                        <TouchableOpacity
                            key={item.businessId}
                            onPress={() => router.push({ pathname: '/SalonDetailScreen', params: { salon: JSON.stringify(item) } })}
                            style={{ marginBottom: 12 }}
                        >
                            <SalonCard
                                {...item}
                                fullWidth
                                liked={true}
                                onToggleLike={() => { }}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    empty: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 40,
    },
});