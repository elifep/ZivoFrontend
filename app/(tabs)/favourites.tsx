import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SalonCard from '@/src/components/SalonCard';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { getAllSalons } from '@/src/services/salonService';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const { colors, isDark } = useAppTheme();
    const { t } = useTranslation();

    useEffect(() => {
        getAllSalons().then((salons) => {
            const likedSalons = salons.filter((salon) => salon.liked);
            setFavorites(likedSalons);
        });
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} translucent={false} />
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