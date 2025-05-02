import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    selected: string;
    onSelect: (category: string) => void;
}

const categories = ['Hepsi', 'Saç Hizmetleri', 'Tırnak Hizmetleri', 'Cilt Bakımı'];

export default function ExploreHeader({ selected, onSelect }: Props) {
    const { colors } = useAppTheme();

    return (
        <View style={[{ padding: 8, paddingTop: 16 }, { backgroundColor: '#000000' }]}>
            {/* Arama Kutusu */}
            <View style={[styles.searchBox, { backgroundColor: colors.searchBackground }]}>
                <Feather name="search" size={18} color={colors.icon} style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Hizmet veya işletme adını arayın"
                    placeholderTextColor={colors.icon}
                    style={[styles.input, { color: colors.text }]}
                />
            </View>

            {/* Nereye - Ne Zaman */}
            <View style={styles.row}>
                <TouchableOpacity style={[styles.optionBox, { backgroundColor: colors.card }]}>
                    <Feather name="map-pin" size={16} color={colors.icon} />
                    <Text style={[styles.optionText, { color: colors.text }]}>Nereye?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.optionBox, { backgroundColor: colors.card }]}>
                    <Feather name="calendar" size={16} color={colors.icon} />
                    <Text style={[styles.optionText, { color: colors.text }]}>Ne Zaman?</Text>
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
        </View>
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