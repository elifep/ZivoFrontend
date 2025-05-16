import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import SalonCard from '@/components/SalonCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllBusinesses } from '@/services/businessService';
import { useRouter } from 'expo-router';
import { useFavouriteStore } from '@/stores/favouriteStore';
import * as Animatable from 'react-native-animatable';

export default function FavoritesScreen() {
    const [favoriteSalons, setFavoriteSalons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { colors } = useAppTheme();
    const { t } = useTranslation();
    const router = useRouter();
    const { favourites, fetchFavourites, toggleFavourite } = useFavouriteStore();

    useEffect(() => {
        setIsLoading(true);
        fetchFavourites();
        getAllBusinesses()
            .then((data) => {
                const matched = data.filter((item: any) =>
                    favourites.some((fav) => fav.businessid === item.businessid)
                );

                const formatted = matched.map((item: any) => ({
                    businessId: item.businessid,
                    businessName: item.businessname,
                    adressline1: item.adressline1,
                    image_url: item.signed_url || item.image_url || 'https://cdn-icons-png.flaticon.com/512/2920/2920068.png',
                }));

                setFavoriteSalons(formatted);
            })
            .finally(() => setTimeout(() => setIsLoading(false), 500)); // kısa bir gecikme animasyon için
    }, [favourites.length]); // favourites değiştiğinde tekrar çalışır

    const handleToggle = (businessId: string) => {
        toggleFavourite(businessId);
        setFavoriteSalons((prev) =>
            prev.filter((item) => item.businessId !== businessId)
        );
    };

    return (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: colors.background }]}>
            <ScrollView style={{
                paddingTop: 12,
                paddingHorizontal: 16, backgroundColor: colors.background
            }}>
                <Text style={[styles.title, { color: colors.text }]}>{t('favourites.title')}</Text>

                {isLoading ? (
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={{ color: colors.icon, marginTop: 10 }}>{t('loading')}</Text>
                    </View>
                ) : favoriteSalons.length === 0 ? (
                    <Text style={[styles.empty, { color: colors.icon }]}>{t('favourites.empty')}</Text>
                ) : (
                    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                        {favoriteSalons.map((item) => (
                            <Animatable.View
                                key={item.businessId}
                                animation="fadeInUp"
                                duration={500}
                                style={{ marginBottom: 12 }}
                            >
                                <TouchableOpacity
                                    onPress={() =>
                                        router.push({ pathname: '/SalonDetailScreen', params: { salon: JSON.stringify(item) } })
                                    }
                                >
                                    <SalonCard
                                        {...item}
                                        fullWidth
                                        liked={true}
                                        onToggleLike={() => handleToggle(item.businessId)}
                                    />
                                </TouchableOpacity>
                            </Animatable.View>
                        ))}
                    </ScrollView>
                )}
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
});