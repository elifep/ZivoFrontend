import { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import ExploreHeader from '@/components/ExploreHeader';
import FilterRow from '@/components/FilterRow';
import SalonCard from '@/components/SalonCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getAllBusinesses } from '@/services/businessService';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function IndexScreen() {
  const [salons, setSalons] = useState<any[]>([]);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(t('explore.categories.all'));
  const router = useRouter();
  useEffect(() => {
    getAllBusinesses().then((data) => {
      console.log('Gelen veriler:', data);
      const formatted = data.map((item: any) => ({
        businessId: item.businessid,
        businessName: item.businessname,
        address: item.address,
        image_url: item.image_url,
        liked: false,
      }));
      setSalons(formatted);
    }).catch((err) => {
      console.log('Business fetch error:', err);
    });
  }, []);


  const toggleLike = (id: string) => {
    setSalons((prev) =>
      prev.map((item) => (item.businessId === id ? { ...item, liked: !item.liked } : item))
    );
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#000',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }}>
      <StatusBar backgroundColor={colors.background} translucent={false} />
      <ScrollView style={{ backgroundColor: colors.background }}>
        <ExploreHeader selected={selectedCategory} onSelect={setSelectedCategory} />
        <FilterRow />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('explore.title')}</Text>

        {salons.length > 0 ? (
          salons.map((item) => (
            <TouchableOpacity
              key={item.businessId}
              onPress={() => router.push({ pathname: '/SalonDetailScreen', params: { salon: JSON.stringify(item) } })}
              style={{ paddingHorizontal: 16, marginBottom: 12 }}
            >
              <SalonCard
                businessName={item.businessName}
                address={item.address}
                image_url={item.image_url}
                fullWidth
                liked={item.liked}
                onToggleLike={() => toggleLike(item.businessId)}
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ padding: 16, color: colors.text }}>{t('explore.noSalons')}</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
});
