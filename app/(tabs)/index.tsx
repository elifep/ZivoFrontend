import { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import ExploreHeader from '@/components/ExploreHeader';
import FilterRow from '@/components/FilterRow';
import SalonCard from '@/components/SalonCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getAllBusinesses } from '@/services/businessService';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useServiceStore } from '@/stores/serviceStore';
import { useFavouriteStore } from '@/stores/favouriteStore';
import * as Animatable from 'react-native-animatable';

export default function IndexScreen() {
  const [salons, setSalons] = useState<any[]>([]);
  const [filteredSalons, setFilteredSalons] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(t('explore.categories.all'));
  const router = useRouter();
  const { fetchServices, services } = useServiceStore();
  const { fetchFavourites, toggleFavourite, isFavourited } = useFavouriteStore();

  useEffect(() => {
    setIsLoading(true);
    fetchFavourites();

    getAllBusinesses()
      .then((data) => {
        const formatted = data.map((item: any) => ({
          businessId: item.businessid,
          businessName: item.businessname,
          adressline1: item.adressline1,
          image_url: item.signed_url || item.image_url,
        }));
        setSalons(formatted);
        setFilteredSalons(formatted);
        data.forEach((item: any) => {
          fetchServices(item.businessid);
        });
      })
      .finally(() => setTimeout(() => setIsLoading(false), 400)); // hızlı ama akıcı
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredSalons(salons);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = salons.filter((salon) => {
        const matchSalonName = salon.businessName.toLowerCase().includes(lowerSearch);
        const matchService = services.some((service) =>
          service.businessid === salon.businessId &&
          service.name.toLowerCase().includes(lowerSearch)
        );
        return matchSalonName || matchService;
      });
      setFilteredSalons(filtered);
    }
  }, [searchTerm, salons, services]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000', paddingTop: 12 }}>
      <ScrollView style={{ backgroundColor: colors.background }}>
        <ExploreHeader
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <FilterRow />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('explore.title')}
        </Text>

        {isLoading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 10, color: colors.icon }}>{t('loading')}</Text>
          </View>
        ) : filteredSalons.length > 0 ? (
          filteredSalons.map((item) => (
            <Animatable.View
              key={item.businessId}
              animation="fadeInUp"
              duration={400}
              style={{ paddingHorizontal: 16, marginBottom: 12 }}
            >
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/SalonDetailScreen',
                    params: { salon: JSON.stringify(item) },
                  })
                }
              >
                <SalonCard
                  businessName={item.businessName}
                  adressline1={item.adressline1}
                  image_url={item.image_url}
                  fullWidth
                  liked={isFavourited(item.businessId)}
                  onToggleLike={() => toggleFavourite(item.businessId)}
                />
              </TouchableOpacity>
            </Animatable.View>
          ))
        ) : (
          <Text style={{ padding: 16, color: colors.text }}>
            {t('explore.noSalons')}
          </Text>
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
  loadingWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
});