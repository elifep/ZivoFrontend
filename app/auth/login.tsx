import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/stores/authStore';
import { I18nManager } from 'react-native';

export default function LoginScreen() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isRTL = I18nManager.isRTL; // Yön tespiti
    const handleLogin = async () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: t('toast.missingFieldsTitle'),
                text2: t('toast.missingFields'),
            });
            return;
        }
        try {
            await useAuthStore.getState().login(email, password);
            Toast.show({
                type: 'success',
                text1: t('toast.loginSuccessTitle'),
                text2: t('toast.loginSuccess'),
            });
            router.replace('/(tabs)');
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: t('toast.loginErrorTitle'),
                text2: t('toast.loginError'),
            });
        }
    };
    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 70, alignContent: 'center' }}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Logo */}
                <Image
                    source={require('../../assets/zivo.png')}
                    style={{
                        width: 450,          // ✅ genişlik ayarlandı
                        height: 200,          // ✅ yükseklik ayarlandı
                        resizeMode: 'contain',
                        alignSelf: 'center', // ✅ ortalanmış konum
                        marginBottom: 24,    // ✅ altındaki öğeyle mesafe
                    }} />

                {/* Başlık */}
                <Text style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 6 }}>{t('auth.welcome')}</Text>
                <Text style={{ fontSize: 28, fontWeight: '500', marginBottom: 20 }}>{t('auth.login')}</Text>

                {/* Form */}
                <TextInput style={[styles.input, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}placeholder={t('auth.emailPlaceholder')} placeholderTextColor="#999" value={email}
                    onChangeText={setEmail} />
                <TextInput style={[styles.input, { writingDirection: isRTL ? 'rtl' : 'ltr' }]}placeholder={t('auth.passwordPlaceholder')} secureTextEntry placeholderTextColor="#999" value={password}
                    onChangeText={setPassword} />

                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                    <Text style={styles.loginBtnText}>{t('auth.login')}</Text>
                </TouchableOpacity>

                <Text style={styles.registerText}>
                    {t('auth.noAccount')}<Text style={{ fontWeight: 'bold' }} onPress={() => router.push('/auth/register')}>{t('auth.createNow')}</Text>
                </Text>

                <Text style={styles.orText}>{t('auth.or')}</Text>

                {/* Sosyal Giriş */}
                {/* Apple */}
                <TouchableOpacity style={styles.socialBtn}>
                    <FontAwesome name="apple" size={20} color="#000" style={{ marginRight: 10 }} />
                    <Text style={styles.socialText}>{t('auth.continueWithApple')}</Text>
                </TouchableOpacity>

                {/* Facebook */}
                <TouchableOpacity style={styles.socialBtn}>
                    <FontAwesome name="facebook" size={20} color="#1877F2" style={{ marginRight: 10 }} />
                    <Text style={styles.socialText}>{t('auth.continueWithFacebook')}</Text>
                </TouchableOpacity>

                {/* Google */}
                <TouchableOpacity style={styles.socialBtn}>
                    <FontAwesome name="google" size={20} color="#EA4335" style={{ marginRight: 10 }} />
                    <Text style={styles.socialText}>{t('auth.continueWithGoogle')}</Text>
                </TouchableOpacity>


                {/* Dil ve Ülke */}
                <LanguageSelector />
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    logo: {
        width: 160,
        height: 110,
        marginTop: 40,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
        textAlign: I18nManager.isRTL ? 'right' : 'left', // buraya ekle

    },
    loginBtn: {
        backgroundColor: '#222',
        borderRadius: 6,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    loginBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    registerText: {
        marginBottom: 16,
        color: '#333',
    },
    orText: {
        color: '#999',
        marginBottom: 14,
    },
    socialBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
        width: '100%',
    },
    socialIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        resizeMode: 'contain',
    },
    socialText: {
        fontWeight: '500',
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 20,
    },
    flagBtn: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagIcon: {
        width: 20,
        height: 14,
        marginRight: 6,
    },
    flagText: {
        fontSize: 13,
        fontWeight: '600',
    },
});  