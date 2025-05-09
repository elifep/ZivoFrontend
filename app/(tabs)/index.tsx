import { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import ExploreHeader from '@/components/ExploreHeader';
import FilterRow from '@/components/FilterRow';
import SalonCard from '@/components/SalonCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getAllBusinesses } from '@/services/businessService';
import { useRouter } from 'expo-router';
import { API_URL } from '@/config/config';

export default function IndexScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [salons, setSalons] = useState<any[]>([]);
  const { colors } = useAppTheme();
  const router = useRouter();
  console.log("IndexScreen yüklendi")
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
      <ScrollView style={{ backgroundColor: colors.background }}>
        <ExploreHeader selected={selectedCategory} onSelect={setSelectedCategory} />
        <FilterRow />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tüm Salonlar</Text>

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
          <Text style={{ padding: 16, color: colors.text }}>Salon bulunamadı.</Text>
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
