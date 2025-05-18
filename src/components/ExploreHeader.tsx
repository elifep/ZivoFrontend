import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    selected: string;
    onSelect: (category: string) => void;
    searchTerm: string;
    onSearchChange: (text: string) => void;
}

export default function ExploreHeader({ selected, onSelect, searchTerm, onSearchChange }: Props) {
    const { colors } = useAppTheme();
    const { t } = useTranslation();

    const categories = [t('explore.categories.all'), t('explore.categories.hair'), t('explore.categories.nail'), t('explore.categories.skin')];
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

            {/* Nereye - Ne Zaman */}
            <View style={styles.row}>
                <TouchableOpacity style={[styles.optionBox, { backgroundColor: colors.card }]}>
                    <Feather name="map-pin" size={16} color={colors.icon} />
                    <Text style={[styles.optionText, { color: colors.text }]}>{t('explore.location')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.optionBox, { backgroundColor: colors.card }]}>
                    <Feather name="calendar" size={16} color={colors.icon} />
                    <Text style={[styles.optionText, { color: colors.text }]}>{t('explore.date')}</Text>
                </TouchableOpacity>
            </View>

            {/* Kategoriler */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => onSelect(cat)}
                        style={[
                            styles.tab,
                            selected === cat && { borderBottomColor: '#fff', borderBottomWidth: 2 },
                        ]}
                    >
                        <Text
                            style={{
                                color: selected === cat ? '#fff' : '#ccc',
                                fontWeight: selected === cat ? 'bold' : '500',
                            }}
                        >
                            {cat}
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
        alignItems: 'flex-start'
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