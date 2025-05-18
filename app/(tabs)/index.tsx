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
import { Ionicons } from '@expo/vector-icons'; // veya Feather, FontAwesome gibi

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
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setIsReady(true);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
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
      {isReady && (
        <TouchableOpacity
          onPress={() => {
            try {
              router.push('/MapScreen');
            } catch (err) {
              console.log('Map yönlendirme hatası:', err);
            }
          }}
          style={styles.floatingMapButton}
        >
          <Ionicons name="map-outline" size={20} color="white" />
          <Text style={styles.mapButtonText}>Map</Text>
        </TouchableOpacity>
      )}

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
  floatingMapButton: {
    position: 'absolute',
    bottom: 30, // tab bar'ın üstü
    right: 30,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  mapButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});