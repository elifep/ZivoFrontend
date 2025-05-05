import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/src/stores/authStore';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const loadTokens = useAuthStore((state) => state.loadTokens);
    const accessToken = useAuthStore((state) => state.accessToken);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await loadTokens();  // AsyncStorage'dan token oku
            setLoading(false);   // Yükleme tamamlandı
        };
        init();
    }, []);

    if (loading) return null; // İsteğe bağlı: Splash ekran veya boş görünüm
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Token varsa ana ekrana, yoksa login sayfasına yönlendir
    return <Redirect href={accessToken ? '/(tabs)' : '/auth/login'} />;
}