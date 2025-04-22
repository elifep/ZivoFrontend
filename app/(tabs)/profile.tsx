import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

const ThemeOptions = ['light', 'dark'] as const;

export default function ProfileScreen() {
    const { theme, setTheme, colors } = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Tema Seçimi</Text>

            {ThemeOptions.map((option) => (
                <Pressable
                    key={option}
                    onPress={() => setTheme(option)}
                    style={[
                        styles.option,
                        {
                            borderColor: colors.primary,
                            backgroundColor: theme === option ? colors.card : 'transparent',
                        },
                    ]}
                >
                    <Text style={[styles.optionText, { color: colors.text }]}>
                        {option === 'light' ? 'Açık Tema' : 'Koyu Tema'}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
    },
    optionText: {
        fontSize: 16,
    },
});