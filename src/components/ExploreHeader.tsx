import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  onLocationPress: () => void;
  onDatePress: () => void;
  selectedTab: string;
  onSelectTab: (tab: string) => void;
}

export default function ExploreHeader({
  searchTerm,
  onSearchChange,
  onLocationPress,
  onDatePress,
  selectedTab,
  onSelectTab,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const categories = [
    { key: 'all', label: t('explore.categories.all') },
    { key: 'hair', label: t('explore.categories.hair') },
    { key: 'nail', label: t('explore.categories.nail') },
    { key: 'skin', label: t('explore.categories.skin') },
  ];

  return (
    <SafeAreaView style={[{ padding: 8, paddingTop: 16 }, { backgroundColor: '#000000' }]}>
      {/* Arama Kutusu */}
      <View style={[styles.searchBox, { backgroundColor: colors.searchBackground }]}>
        <Feather name="search" size={18} color={colors.icon} style={{ marginRight: 8 }} />
        <TextInput
          placeholder={t('explore.searchPlaceholder')}
          placeholderTextColor={colors.icon}
          value={searchTerm}
          onChangeText={onSearchChange}
          style={[styles.input, { color: colors.text }]}
        />
      </View>

      {/* Konum ve Tarih Butonları */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.optionBox, { backgroundColor: colors.card }]}
          onPress={onLocationPress}
        >
          <Feather name="map-pin" size={16} color={colors.icon} />
          <Text style={[styles.optionText, { color: colors.text }]}>{t('explore.location')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionBox, { backgroundColor: colors.card }]}
          onPress={onDatePress}
        >
          <Feather name="calendar" size={16} color={colors.icon} />
          <Text style={[styles.optionText, { color: colors.text }]}>{t('explore.date')}</Text>
        </TouchableOpacity>
      </View>

      {/* Sekmeler */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => onSelectTab(cat.key)}
            style={[
              styles.tab,
              selectedTab === cat.key && { borderBottomColor: '#fff', borderBottomWidth: 2 },
            ]}
          >
            <Text
              style={{
                color: selectedTab === cat.key ? '#fff' : '#ccc',
                fontWeight: selectedTab === cat.key ? 'bold' : '500',
              }}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  optionBox: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  optionText: {
    fontSize: 14,
  },
  tabBar: {
    marginTop: 12,
  },
  tab: {
    marginRight: 16,
    paddingBottom: 4,
  },
});
