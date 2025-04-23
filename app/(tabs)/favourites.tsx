import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SalonCard from '@/components/SalonCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getAllSalons } from '@/services/salonService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const { colors } = useAppTheme();
    const { t } = useTranslation();

    useEffect(() => {
        getAllSalons().then((salons) => {
            const likedSalons = salons.filter((salon) => salon.liked);
            setFavorites(likedSalons);
        });
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                {t('favourites.title')}
            </Text>

            {favorites.length === 0 ? (
                <Text style={[styles.empty, { color: colors.icon }]}>
                    Henüz favorilere eklenmiş salon yok.
                </Text>
            ) : (
                favorites.map((item) => (
                    <View key={item.id} style={{ marginBottom: 12 }}>
                        <SalonCard {...item} fullWidth />
                    </View>
                ))
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    empty: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 40,
    },
});