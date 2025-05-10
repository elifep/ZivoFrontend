import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import ReviewTab from '@/components/ReviewTab'; // 📌 Yorumlar için komponent import edildi
import PortfolioTab from '@/components/PortfolioTab'; // 📌 Görseller için komponent import edildi
import SalonDetailsTab from '@/components/SalonDetailsTab'; // doğru path'e göre ayarla
import { useAppTheme } from '@/hooks/useAppTheme';
import { API_URL } from '@/config/config';
import { useServiceStore } from '@/stores/serviceStore';
import { useEffect } from 'react';

export default function SalonDetailScreen() {
    const { colors, isDark } = useAppTheme();
    const router = useRouter();
    const { salon } = useLocalSearchParams();
    const salonData = JSON.parse(salon as string);
    const [isLiked, setIsLiked] = useState(salonData.liked);
    const { services, fetchServices, loading } = useServiceStore();

    const [selectedTab, setSelectedTab] = useState('Hizmetler');
    const [searchTerm, setSearchTerm] = useState('');

    // const filteredServices = dummyServices.filter(service =>
    //     service.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    useEffect(() => {
        if (salonData?.businessId) {
            fetchServices(salonData.businessId);
        }
    }, [salonData?.businessId]);
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar
                backgroundColor={colors.background}
                barStyle={isDark ? 'light-content' : 'dark-content'}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Salon Görseli */}
                <View style={styles.imageContainer}>
                    {salonData.image_url ? (
                        <Image
                            source={{ uri: salonData.image_url.startsWith('http') ? salonData.image_url : `${API_URL}/${salonData.image_url}` }}
                            style={[styles.salonImage, { backgroundColor: colors.background }]}
                        />
                    ) : (
                        <View style={[styles.salonImage, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: '#000' }}>Fotoğraf Yok</Text>
                        </View>
                    )}

                    {/* Geri Dön Butonu */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color="black" />
                    </TouchableOpacity>

                    {/* Puan Kutusu */}
                    <View style={styles.starBox}>
                        <Ionicons name="star-outline" size={16} color="#000" />
                        <Text style={styles.starBoxText}>eee</Text>
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
                <View style={[styles.tabContainer, { backgroundColor: colors.background }]}>
                    {['Hizmetler', 'Yorumlar', 'Portföy', 'Detaylar'].map(tab => (
                        <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)} style={styles.tabButton}>
                            <Text style={[styles.tabText, { color: colors.text }, selectedTab === tab && styles.activeTabText, selectedTab === tab && { color: colors.primary }]}>
                                {tab}
                            </Text>
                            {selectedTab === tab && <View style={[styles.activeTabIndicator, { backgroundColor: colors.primary }]} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* İçerik */}
                {selectedTab === 'Hizmetler' && (
                    <View style={[styles.servicesContainer, { backgroundColor: colors.background }]}>
                        <TextInput
                            placeholder="Hizmet arayın..."
                            placeholderTextColor="#888"
                            style={[styles.searchInput, { backgroundColor: colors.searchBackground }, { color: colors.text }]}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                        {services.map((service) => (
                            <View key={service.servicesid}>
                                <Text>{service.name}</Text>
                                <Text>{service.price} ₺</Text>
                                <Text>{service.duration_min} dk</Text>
                            </View>
                        ))}
                        {/* {filteredServices.map((service, index) => (
                            <View key={index} style={[styles.serviceRow, { borderBottomColor: colors.borderBottom }]}>
                                <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
                                <View style={styles.serviceRight}>
                                    <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                                        <Text style={[styles.priceText, { color: colors.text }]}>{service.price} ₺</Text>
                                        <Text style={[styles.durationText, { color: colors.durationText }]}>{service.duration}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.bookButton, { backgroundColor: colors.primary }]}
                                        onPress={() => router.push('/RandevuScreen')}>
                                        <Text style={[styles.bookButtonText, { color: colors.background }]}>Randevu Al</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))} */}
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
    tabContainer: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1 },
    tabButton: { flex: 1, alignItems: 'center' },
    tabText: { fontSize: 14 },
    activeTabText: { fontWeight: 'bold' },
    activeTabIndicator: { width: '100%', height: 2, marginTop: 4 },
    servicesContainer: { padding: 16 },
    searchInput: { padding: 10, borderRadius: 8, marginBottom: 16 },
    serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
    serviceName: { fontSize: 16 },
    serviceRight: { flexDirection: 'row', alignItems: 'center' },
    priceText: { fontSize: 15, fontWeight: 'bold' },
    durationText: { fontSize: 12 },
    bookButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
    bookButtonText: { fontSize: 12 },
    tabContent: { padding: 16 },
});