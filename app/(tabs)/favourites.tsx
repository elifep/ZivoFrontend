import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function FavouritesScreen() {
    const { colors } = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.text, { color: colors.text }]}>Favorilerim Sayfası</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
    },
});