import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

interface Props {
  onFilterPress: () => void;
  selectedSort: 'recommended' | 'nearby' | 'topRated' | 'mostBooked';
  onSortChange: (sort: 'recommended' | 'nearby' | 'topRated' | 'mostBooked') => void;
}

export default function FilterRow({ onFilterPress, selectedSort, onSortChange }: Props) {
  const { colors } = useAppTheme();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const sortLabels: Record<typeof selectedSort, string> = {
    recommended: 'Recommended',
    nearby: 'Nearest',
    topRated: 'Top Rated',
    mostBooked: 'Most Booked',
  };

  const sortOptions: { key: typeof selectedSort; label: string }[] = [
    { key: 'recommended', label: 'Recommended' },
    { key: 'nearby', label: 'Nearest' },
    { key: 'topRated', label: 'Top Rated' },
    { key: 'mostBooked', label: 'Most Booked' },
  ];

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.button, { borderColor: colors.border }]}
        onPress={onFilterPress}
      >
        <Feather name="sliders" size={16} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Filter</Text>
      </TouchableOpacity>

      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={[styles.button, { borderColor: colors.border }]}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Feather name="list" size={16} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Sort by: {sortLabels[selectedSort]}
          </Text>
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {sortOptions.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => {
                  onSortChange(opt.key);
                  setDropdownVisible(false);
                }}
                style={styles.dropdownItem}
              >
                <Text style={{ color: colors.text }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  button: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 13,
  },
  dropdown: {
    position: 'absolute',
    top: 44,
    left: 0,
    width: 180,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
});
