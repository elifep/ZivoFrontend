import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import ReviewTab from '@/components/ReviewTab'; // 📌 Yorumlar için komponent import edildi
import PortfolioTab from '@/components/PortfolioTab'; // 📌 Görseller için komponent import edildi
import SalonDetailsTab from '@/components/SalonDetailsTab'; // doğru path'e göre ayarla

interface Service {
    name: string;
    price: number;
    duration: string;
}

const dummyServices: Service[] = [
    { name: 'Manikür', price: 350, duration: '30 dk' },
    { name: 'Kaş Alma', price: 120, duration: '15 dk' },
    { name: 'Saç Kesimi', price: 450, duration: '30 dk' },
    { name: 'Pedikür', price: 350, duration: '30 dk' },
    { name: 'Cilt Bakımı', price: 700, duration: '60 dk' },
    { name: 'İpek Kirpik', price: 1000, duration: '45 dk' },
    { name: 'Kirpik Lifting', price: 400, duration: '30 dk' },
];

export default function SalonDetailScreen() {
    const router = useRouter();
    const { salon } = useLocalSearchParams();
    const salonData = JSON.parse(salon as string);

    const [isLiked, setIsLiked] = useState(salonData.liked);
    const [selectedTab, setSelectedTab] = useState('Hizmetler');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredServices = dummyServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Salon Görseli */}
                <View style={styles.imageContainer}>
                    <Image source={salonData.image} style={styles.salonImage} />

                    {/* Geri Dön Butonu */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color="black" />
                    </TouchableOpacity>

                    {/* Puan Kutusu */}
                    <View style={styles.starBox}>
                        <Ionicons name="star-outline" size={16} color="#000" />
                        <Text style={styles.starBoxText}>{salonData.rating.toFixed(1)}</Text>
                    </View>

                    {/* Siyah Bilgi Alanı (Resmin Üstünde) */}
                    <View style={styles.salonInfoContainer}>
                        <View style={styles.salonTopRow}>
                            <Text style={styles.salonName}>{salonData.name}</Text>
                            <View style={styles.rightIcons}>
                                {salonData.discount && (
                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountText}>{salonData.discount}</Text>
                                    </View>
                                )}
                                <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
                                    <Feather name={isLiked ? 'heart' : 'heart'} size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.salonAddress}>{salonData.address}</Text>
                    </View>
                </View>

                {/* Sekmeler */}
                <View style={styles.tabContainer}>
                    {['Hizmetler', 'Yorumlar', 'Portföy', 'Detaylar'].map(tab => (
                        <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)} style={styles.tabButton}>
                            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                                {tab}
                            </Text>
                            {selectedTab === tab && <View style={styles.activeTabIndicator} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* İçerik */}
                {selectedTab === 'Hizmetler' && (
                    <View style={styles.servicesContainer}>
                        <TextInput
                            placeholder="Hizmet arayın..."
                            placeholderTextColor="#888"
                            style={styles.searchInput}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                        {filteredServices.map((service, index) => (
                            <View key={index} style={styles.serviceRow}>
                                <Text style={styles.serviceName}>{service.name}</Text>
                                <View style={styles.serviceRight}>
                                    <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                                        <Text style={styles.priceText}>{service.price} ₺</Text>
                                        <Text style={styles.durationText}>{service.duration}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.bookButton}
                                        onPress={() => router.push('/RandevuScreen')}>
                                        <Text style={styles.bookButtonText}>Randevu Al</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {selectedTab === 'Yorumlar' && (
                    <ReviewTab />
                )}

                {selectedTab === 'Portföy' && (
                    <PortfolioTab />
                )}

                {selectedTab === 'Detaylar' && (
                    <SalonDetailsTab />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    /* aynı senin verdiğin style yapısı */
    imageContainer: { position: 'relative' },
    salonImage: { width: '100%', height: 200 },
    backButton: { position: 'absolute', top: 40, left: 16, backgroundColor: '#fff', padding: 6, borderRadius: 20 },
    starBox: { position: 'absolute', top: 40, right: 16, backgroundColor: '#fff', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, flexDirection: 'row', alignItems: 'center' },
    starBoxText: { marginLeft: 4, fontWeight: 'bold', fontSize: 12 },
    salonInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 12,
    },
    salonTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    salonName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    rightIcons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    discountBadge: { backgroundColor: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    discountText: { fontSize: 12, fontWeight: 'bold', color: '#000' },
    salonAddress: { color: '#ccc', fontSize: 13, marginTop: 2 },
    tabContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 8, borderBottomColor: '#eee', borderBottomWidth: 1 },
    tabButton: { flex: 1, alignItems: 'center' },
    tabText: { color: '#888', fontSize: 14 },
    activeTabText: { color: '#000', fontWeight: 'bold' },
    activeTabIndicator: { width: '100%', height: 2, backgroundColor: '#000', marginTop: 4 },
    servicesContainer: { padding: 16 },
    searchInput: { backgroundColor: '#f3f3f3', padding: 10, borderRadius: 8, marginBottom: 16, color: '#000' },
    serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomColor: '#eee', borderBottomWidth: 1 },
    serviceName: { fontSize: 16, color: '#000' },
    serviceRight: { flexDirection: 'row', alignItems: 'center' },
    priceText: { fontSize: 15, fontWeight: 'bold', color: '#000' },
    durationText: { fontSize: 12, color: '#999' },
    bookButton: { backgroundColor: '#000', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
    bookButtonText: { color: '#fff', fontSize: 12 },
    tabContent: { padding: 16 },
});