import { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Modal, TextInput } from 'react-native';
import ExploreHeader from '@/components/ExploreHeader';
import FilterRow from '@/components/FilterRow';
import SalonCard from '@/components/SalonCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useServiceStore } from '@/stores/serviceStore';
import { useFavouriteStore } from '@/stores/favouriteStore';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons'; // veya Feather, FontAwesome gibi
import { useReviewStore } from '@/stores/reviewStore';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { useBusinessStore } from '@/stores/businessStore';
import { haversineDistance } from '@/utils/geo';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { Service } from '@/stores/serviceStore';
export default function IndexScreen() {
  const [salons, setSalons] = useState<any[]>([]);
  const [filteredSalons, setFilteredSalons] = useState<any[]>([]);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const { fetchAverageByBusinessId } = useReviewStore();
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { fetchServices, allServices, fetchAllServices } = useServiceStore();
  const { toggleFavourite, isFavourited } = useFavouriteStore();
  const { location, granted } = useLocationPermission();
  const { fetchNearbyBusinesses, fetchBusinesses, fetchTopRatedBusinesses, fetchMostBookedBusinesses, fetchFilteredBusinesses, businesses } = useBusinessStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all'); // Sekme seçimi (örnek: all, hair vs.)
  const [filterModalVisible, setFilterModalVisible] = useState(false); // Modal aç/kapa
  const [showDatePicker, setShowDatePicker] = useState(false); // Tarih seçici
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSort, setSelectedSort] = useState<'recommended' | 'nearby' | 'topRated' | 'mostBooked'>('recommended');
  const [selectedCategory, setSelectedCategory] = useState('All');
  useEffect(() => {
    fetchAllServices();
  }, []);
  useEffect(() => {
    const loadRatings = async () => {
      const newRatings: Record<string, number> = {};
      for (const salon of businesses) {
        const { average } = await fetchAverageByBusinessId(salon.businessId);
        newRatings[salon.businessId] = average;
      }
      setRatings(newRatings);
    };

    if (businesses.length > 0) {
      loadRatings();
    }
  }, [businesses]);

  useEffect(() => {
    if (location && granted) {
      setIsLoading(true);

      const fetchData = async () => {
        const all = await fetchBusinesses(); // tüm salonları getir
        const withDistance = all.map((salon) => {
          const dist = haversineDistance(
            { lat: location.latitude, lng: location.longitude },
            { lat: salon.latitude, lng: salon.longitude }
          );
          return { ...salon, distance: dist };
        });

        const sorted = withDistance.sort((a, b) => a.distance - b.distance);

        setSalons(sorted);
        setFilteredSalons(sorted);

        sorted.forEach((item: any) => {
          fetchServices(item.businessId);
        });

        setTimeout(() => setIsLoading(false), 300);
      };

      fetchData();
    }
  }, [location, granted]);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = businesses.filter((salon) => {
      const matchSalonName = salon.businessName.toLowerCase().includes(lowerSearch);
      const matchService = allServices.some((service: Service) =>
        String(service.businessid) === String(salon.businessId) &&
        service.name.toLowerCase().includes(lowerSearch)
      );
      return matchSalonName || matchService;
    });

    if (searchTerm === '') {
      setFilteredSalons(businesses);
    } else {
      setFilteredSalons(filtered);
    }
  }, [searchTerm, businesses, allServices]);

  useEffect(() => {
    const categoryMap: Record<string, string> = {
      [t('explore.categories.hair')]: 'Hair',
      [t('explore.categories.nail')]: 'Nail',
      [t('explore.categories.skin')]: 'Skin',
    };

    const selectedKey = categoryMap[selectedCategory];
    const sourceList = businesses;

    let filtered = sourceList;

    if (selectedKey) {
      filtered = sourceList.filter((salon) =>
        allServices.some((s: Service) =>
          s.businessid === salon.businessId &&
          s.name.toLowerCase().includes(selectedKey.toLowerCase())
        )
      );
    }

    // Arama terimi de varsa hem kategori hem arama eşleşsin
    const lowerSearch = searchTerm.toLowerCase();
    if (searchTerm !== '') {
      filtered = filtered.filter((salon) => {
        const matchName = salon.businessName.toLowerCase().includes(lowerSearch);
        const matchService = allServices.some((service) =>
          service.businessid === salon.businessId &&
          service.name.toLowerCase().includes(lowerSearch)
        );
        return matchName || matchService;
      });
    }

    setFilteredSalons(filtered);
  }, [selectedCategory, searchTerm, businesses, allServices]);

  const handleSortChange = async (sort: typeof selectedSort) => {
    setSelectedSort(sort);

    if (sort === 'topRated') {
      const result = await fetchTopRatedBusinesses();
      setFilteredSalons(result);
    } else if (sort === 'mostBooked') {
      const result = await fetchMostBookedBusinesses();
      setFilteredSalons(result);
    } else if (sort === 'nearby' && location) {
      const result = await fetchNearbyBusinesses(location.latitude, location.longitude);
      setFilteredSalons(result);
    } else {
      const result = await fetchBusinesses();
      setFilteredSalons(result);
    }
  };
  const normalizedCity = selectedCity.trim().toLowerCase();
  const normalizedTown = selectedTown.trim().toLowerCase();
  const normalizedQuery = searchTerm.trim().toLowerCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000', paddingTop: 12 }}>

      <ExploreHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onLocationPress={() => setFilterModalVisible(true)}
        onDatePress={() => setShowDatePicker(true)}
        selectedTab={selectedTab}
        onSelectTab={(key) => {
          setSelectedTab(key);
          // "Tümü" sekmesine tıklandığında tüm salonları yeniden göster
          if (key === 'all') {
            setSearchTerm('');
            setSelectedCity('');
            setSelectedTown('');
            setSelectedDate('');
            fetchBusinesses().then((all) => {
              setFilteredSalons(all);
            });
          }
        }}
      />
      {/* Şehir / İlçe / Tarih Modal */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text>City</Text>
            <TextInput
              placeholder="İstanbul"
              value={selectedCity}
              onChangeText={setSelectedCity}
              style={styles.input}
            />

            <Text>District</Text>
            <TextInput
              placeholder="Kadıköy"
              value={selectedTown}
              onChangeText={setSelectedTown}
              style={styles.input}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
              <Text>Select Date:{selectedDate || 'Not selected'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                const result = await fetchFilteredBusinesses({
                  city: normalizedCity,
                  town: normalizedTown,
                  date: selectedDate,
                  query: normalizedQuery,
                });
                setFilteredSalons(result);
                setFilterModalVisible(false);
              }}
              style={styles.applyButton}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Apply Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text style={{ marginTop: 10, textAlign: 'center', color: 'gray' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display="default"
          value={selectedDate ? new Date(selectedDate) : new Date()}
          onChange={(e, date) => {
            if (e.type === 'set' && date) {
              setSelectedDate(date.toISOString().split('T')[0]);
            }
            setShowDatePicker(false);
          }}
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display="default"
          value={selectedDate ? new Date(selectedDate) : new Date()}
          onChange={(e, date) => {
            if (e.type === 'set' && date) {
              setSelectedDate(date.toISOString().split('T')[0]);
            }
            setShowDatePicker(false); // her durumda kapat
          }}
        />
      )}

      <ScrollView style={{ backgroundColor: colors.background }}>
        <FilterRow onFilterPress={() => setFilterModalVisible(true)}
          selectedSort={selectedSort}
          onSortChange={handleSortChange} />


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
                  rating={ratings[item.businessId]} // ⭐️ burada veriyoruz
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
      <TouchableOpacity
        onPress={() => {
          router.push('/MapScreen');
        }}
        style={styles.floatingMapButton}
      >
        <Ionicons name="map-outline" size={20} color="white" />
        <Text style={styles.mapButtonText}>Map</Text>
      </TouchableOpacity>

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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa',
  },
  modalBox: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  input: {
    borderBottomWidth: 1,
    marginVertical: 8,
    paddingVertical: 4,
  },
  dateButton: {
    backgroundColor: '#eee',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
  },
  applyButton: {
    marginTop: 16,
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 6,
  },

});