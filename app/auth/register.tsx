import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/src/components/LanguageSelector';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/src/stores/authStore';

export default function RegisterScreen() {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const register = useAuthStore((state) => state.register);

    const handleRegister = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: t('toast.missingFieldsTitle'),
                text2: t('toast.missingFields'),
            });
            return;
        }
        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: t('auth.confirmPasswordError'),
            });
            return;
        }

        try {
            await register(email, password);
            Toast.show({
                type: 'success',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 50,
                text1: t('auth.register'),
                text2: t('auth.registerSuccess'),
            });
            router.replace('/(tabs)');
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Kayıt başarısız',
                text2: error.message,
            });
        }   
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Logo */}
            <Image
                source={require('@/assets/zivo.png')}
                style={{ width: 450, height: 200, resizeMode: 'contain', alignSelf: 'center', marginBottom: 24 }}
            />

            {/* Başlık */}
            <Text style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 6 }}>{t('auth.welcome')}</Text>
            <Text style={{ fontSize: 28, fontWeight: '500', marginBottom: 20 }}>{t('auth.register')}</Text>

            {/* Form */}
            <Text style={styles.label}>E-Mail:</Text>
            <TextInput
                style={styles.input}
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#999"
            />

            <Text style={styles.label}>{t('auth.password')}:</Text>
            <TextInput
                style={styles.input}
                placeholder={t('auth.passwordPlaceholder')}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#999"
            />

            <Text style={styles.label}>{t('auth.confirmPassword')}:</Text>
            <TextInput
                style={styles.input}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#999"
            />

            {error !== '' && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
                <Text style={styles.loginBtnText}>{t('auth.register')}</Text>
            </TouchableOpacity>

            {/* Dil ve Ülke */}
            <LanguageSelector />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    label: {
        alignSelf: 'flex-start',
        marginBottom: 4,
        marginTop: 8,
        fontWeight: '500',
        fontSize: 14,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
    },
    loginBtn: {
        backgroundColor: '#222',
        borderRadius: 6,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
        marginTop: 8,
    },
    loginBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    error: {
        color: 'red',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
});