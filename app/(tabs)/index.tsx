import { useEffect, useState } from 'react';
import { View, ScrollView, FlatList, Text, StyleSheet } from 'react-native';
import ExploreHeader from '@/components/ExploreHeader';
import FilterRow from '@/components/FilterRow';
import SalonCard from '@/components/SalonCard';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getAllSalons, getCampaignSalons } from '@/services/salonService';

export default function IndexScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Hepsi');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [salons, setSalons] = useState<any[]>([]);
  const { colors } = useAppTheme();

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
          <SalonCard
            {...item}
            isCampaign
            mostLiked={item.mostLiked}
            onToggleLike={() => toggleLike(item.id, 'campaign')}
          />
        )}
      />

      {/* TÜM SALONLAR */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Tüm Salonlar</Text>
      {salons.map((item) => (
        <View key={item.id} style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <SalonCard
            {...item}
            fullWidth
            onToggleLike={() => toggleLike(item.id, 'all')}
          // isCampaign gönderilmiyor = false
          />
        </View>
      ))}
    </ScrollView>
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