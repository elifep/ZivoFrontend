import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const tabs = ['Hizmetler', 'Yorumlar', 'Portföy', 'Detaylar'];

const services = [
    { name: 'Manikür', price: 350, duration: '30 dk' },
    { name: 'Kaş Alma', price: 120, duration: '15 dk' },
    { name: 'Saç Kesimi', price: 450, duration: '30 dk' },
    { name: 'Pedikür', price: 350, duration: '30 dk' },
    { name: 'Cilt Bakımı', price: 700, duration: '60 dk' },
    { name: 'İpek Kirpik', price: 1000, duration: '45 dk' },
    { name: 'Kirpik Lifting', price: 400, duration: '30 dk' },
];

export default function SalonServicesScreen() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTabPress = (tab: string) => {
        if (tab === 'Hizmetler') return; // Zaten buradayız
        if (tab === 'Yorumlar') router.push('/salon-reviews');
        if (tab === 'Portföy') router.push('/salon-portfolio');
        if (tab === 'Detaylar') router.push('/salon-details');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Rose Life Nişantaşı</Text>
                </View>

                {/* Sekmeler */}
                <View style={styles.tabsRow}>
                    {tabs.map((tab) => (
                        <TouchableOpacity key={tab} onPress={() => handleTabPress(tab)} style={styles.tabButton}>
                            <Text style={[styles.tabItem, tab === 'Hizmetler' && styles.activeTabItem]}>
                                {tab}
                            </Text>
                            {tab === 'Hizmetler' && <View style={styles.activeTabIndicator} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* İçerik */}
                <View style={styles.container}>
                    <TextInput
                        placeholder="Hizmet arayın..."
                        placeholderTextColor="#888"
                        style={styles.searchInput}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />

                    <FlatList
                        data={filteredServices}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.serviceCard}>
                                <View style={styles.serviceHeader}>
                                    <Text style={styles.serviceName}>{item.name}</Text>
                                    <View style={styles.serviceRight}>
                                        <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                                            <Text style={styles.priceText}>{item.price} ₺</Text>
                                            <Text style={styles.durationText}>{item.duration}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.bookButton}>
                                            <Text style={styles.bookButtonText}>Randevu Al</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginLeft: 10 },
    tabsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    tabButton: { alignItems: 'center', flex: 1 },
    tabItem: { fontSize: 14, color: '#888' },
    activeTabItem: { fontWeight: 'bold', color: '#000' },
    activeTabIndicator: { width: '100%', height: 2, backgroundColor: '#000', marginTop: 4 },
    container: { padding: 16 },
    searchInput: {
        backgroundColor: '#f3f3f3',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
        color: '#000',
    },
    serviceCard: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    serviceName: { fontSize: 16, fontWeight: '500', color: '#000' },
    serviceRight: { flexDirection: 'row', alignItems: 'center' },
    priceText: { fontSize: 15, fontWeight: 'bold', color: '#000' },
    durationText: { fontSize: 12, color: '#999' },
    bookButton: {
        backgroundColor: '#000',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    bookButtonText: { color: '#fff', fontSize: 12 },
});