import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export default function FilterRow() {
    const { colors } = useAppTheme();

    return (
        <View style={styles.row}>
            <TouchableOpacity style={[styles.button, { borderColor: colors.border }]}>
                <Feather name="sliders" size={16} color={colors.text} />
                <Text style={[styles.buttonText, { color: colors.text }]}>Filtrele</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { borderColor: colors.border }]}>
                <Feather name="list" size={16} color={colors.text} />
                <Text style={[styles.buttonText, { color: colors.text }]}>Sırala: Önerilenler</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginTop: 8,
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
});