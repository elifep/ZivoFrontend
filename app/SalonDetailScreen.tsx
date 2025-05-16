import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import ReviewTab from '@/components/ReviewTab'; // 📌 Yorumlar için komponent import edildi
import PortfolioTab from '@/components/PortfolioTab'; // 📌 Görseller için komponent import edildi
import SalonDetailsTab from '@/components/SalonDetailsTab'; // doğru path'e göre ayarla
import { useAppTheme } from '@/hooks/useAppTheme';
import { API_URL } from '@/config/config';
import { useServiceStore } from '@/stores/serviceStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function SalonDetailScreen() {
    const { colors, isDark } = useAppTheme();
    const { t } = useTranslation();
    const router = useRouter();
    const { salon } = useLocalSearchParams();
    const salonData = JSON.parse(salon as string);
    const [isLiked, setIsLiked] = useState(salonData.liked);
    const { services, fetchServices, loading } = useServiceStore();

    const [selectedTab, setSelectedTab] = useState(t('salonDetail.tabs.services'));
    const [searchTerm, setSearchTerm] = useState('');

    const servicesFilter = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );//hizmetleri filtreleme
    useEffect(() => {
        if (salonData?.businessId) {
            fetchServices(salonData.businessId);
        }
    }, [salonData?.businessId]);
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
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
                        <Ionicons name="star" size={16} color="#F7C429" />
                        <Text style={styles.starBoxText}>5.0</Text>
                    </View>

                    {/* Siyah Bilgi Alanı (Resmin Üstünde) */}
                    <View style={styles.salonInfoContainer}>
                        <View style={styles.salonTopRow}>
                            <Text style={styles.salonName}>{salonData.businessName}</Text>
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
                        <Text style={styles.salonAddress}>{salonData.adressline1}</Text>
                    </View>
                </View>

                {/* Sekmeler */}
                <View style={[styles.tabContainer, { backgroundColor: colors.background }]}>
                    {[t('salonDetail.tabs.services'),
                    t('salonDetail.tabs.reviews'),
                    t('salonDetail.tabs.portfolio'),
                    t('salonDetail.tabs.details')].map(tab => (
                        <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)} style={styles.tabButton}>
                            <Text style={[styles.tabText, { color: colors.text }, selectedTab === tab && styles.activeTabText, selectedTab === tab && { color: colors.primary }]}>
                                {tab}
                            </Text>
                            {selectedTab === tab && <View style={[styles.activeTabIndicator, { backgroundColor: colors.primary }]} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* İçerik */}
                {selectedTab === t('salonDetail.tabs.services') && (
                    <View style={[styles.servicesContainer, { backgroundColor: colors.background }]}>
                        <TextInput
                            placeholder={t('salonDetail.searchPlaceholder')}
                            placeholderTextColor="#888"
                            style={[styles.searchInput, { backgroundColor: colors.searchBackground }, { color: colors.text }]}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                        {servicesFilter.map((service, index) => (
                            <View key={index} style={[styles.serviceRow, { borderBottomColor: colors.borderBottom }]}>
                                <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
                                <View style={styles.serviceRight}>
                                    <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                                        <Text style={[styles.priceText, { color: colors.text }]}>{service.price} ₺</Text>
                                        <Text style={[styles.durationText, { color: colors.durationText }]}>{service.duration_min}dk</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.bookButton, { backgroundColor: colors.primary }]}
                                        onPress={() => router.push({
                                            pathname: '/RandevuScreen',
                                            params: {
                                                servicesId: service.servicesid,
                                                businessId: salonData.businessId
                                            }
                                        })}>
                                        <Text style={[styles.bookButtonText, { color: colors.background }]}>{t('salonDetail.bookButton')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {selectedTab === t('salonDetail.tabs.reviews') && (
                    <ReviewTab />
                )}

                {selectedTab === t('salonDetail.tabs.portfolio') && (
                    <PortfolioTab />
                )}

                {selectedTab === t('salonDetail.tabs.details') && (
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
    tabContainer: { flexDirection: 'row', paddingVertical: 8 },
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