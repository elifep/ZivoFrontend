import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'tr', label: 'Türkçe', flag: require('../../assets/flags/tr.png') },
    { code: 'en', label: 'English', flag: require('../../assets/flags/gb.png') },
    { code: 'ar', label: 'العربية', flag: require('../../assets/flags/sa.png') },
];

export default function LanguageSelector() {
    const { i18n } = useTranslation();

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <View style={styles.container}>
            {languages.map((lang) => (
                <TouchableOpacity
                    key={lang.code}
                    style={[
                        styles.langBtn,
                        i18n.language === lang.code && styles.selectedLang,
                    ]}
                    onPress={() => handleLanguageChange(lang.code)}
                >
                    <Image source={lang.flag} style={styles.flagIcon} />
                    <Text style={styles.label}>{lang.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    langBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selectedLang: {
        borderColor: '#000',
    },
    flag: {
        width: 20,
        height: 14,
        marginRight: 6,
    },
    flagIcon: {
        width: 20,
        height: 14,
        marginRight: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
    },
});