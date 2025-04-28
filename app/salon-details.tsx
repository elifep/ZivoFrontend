import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SalonDetailsScreen() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Detaylar</Text>
            </View>
            <View style={styles.content}>
                <Text>Detaylar Sayfası - Buraya salon açıklamaları ve çalışma saatleri gelecek</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    content: { padding: 16 },
});