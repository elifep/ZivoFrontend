import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

const ThemeOptions = ['light', 'dark'] as const;

export default function ProfileScreen() {
    const { t } = useTranslation();
    const { theme, setTheme, colors } = useAppTheme();

    const changeLanguage = (lang: 'tr' | 'en') => {
        i18n.changeLanguage(lang);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.inner}>
                {/* Başlık */}
                <Text style={[styles.title, { color: colors.text }]}>{t('profile.title')}</Text>

                {/* Tema Seçimi */}
                <Text style={[styles.label, { color: colors.icon }]}>{t('profile.theme')}</Text>
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

                {/* Dil Seçimi */}
                <Text style={[styles.label, { color: colors.icon }]}>{t('profile.language')}</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.langBtn, { borderColor: colors.text }]}
                        onPress={() => changeLanguage('tr')}
                    >
                        <Text style={{ color: colors.text }}>🇹🇷 Türkçe</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.langBtn, { borderColor: colors.text }]}
                        onPress={() => changeLanguage('en')}
                    >
                        <Text style={{ color: colors.text }}>🇺🇸 English</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 20,
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
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    langBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8,
    },
});