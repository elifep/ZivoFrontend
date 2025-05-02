import { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import ExploreHeader from '@/src/components/ExploreHeader';
import FilterRow from '@/src/components/FilterRow';
import SalonCard from '@/src/components/SalonCard';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { getAllSalons, getCampaignSalons } from '@/src/services/salonService';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [salons, setSalons] = useState<any[]>([]);
  const { colors } = useAppTheme();
  const router = useRouter();

  useEffect(() => {
    getCampaignSalons().then(setCampaigns);
  }, []);

  useEffect(() => {
    getAllSalons(selectedCategory).then(setSalons);
  }, [selectedCategory]);

  const toggleLike = (id: string, from: 'campaign' | 'all') => {
    const update = (arr: any[]) =>
      arr.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item));

    if (from === 'campaign') {
      setCampaigns(update);
    } else {
      setSalons(update);
    }
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#000',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }}>
      {/* <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="#000" /> */}
      <ScrollView style={{ backgroundColor: colors.background }}>
        <ExploreHeader selected={selectedCategory} onSelect={setSelectedCategory} />
        <FilterRow />

        {/* POPÜLER KAMPANYALAR */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Popüler Kampanyalar</Text>
        <FlatList
          data={campaigns}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/SalonDetailScreen', params: { salon: JSON.stringify(item) } })}
            >
              <SalonCard
                {...item}
                isCampaign
                mostLiked={item.mostLiked}
                onToggleLike={() => toggleLike(item.id, 'campaign')}
              />
            </TouchableOpacity>
          )}
        />

        {/* TÜM SALONLAR */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tüm Salonlar</Text>
        {salons.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push({ pathname: '/SalonDetailScreen', params: { salon: JSON.stringify(item) } })}
            style={{ paddingHorizontal: 16, marginBottom: 12 }}
          >
            <SalonCard
              {...item}
              fullWidth
              onToggleLike={() => toggleLike(item.id, 'all')}
            />
          </TouchableOpacity>
        ))}
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
