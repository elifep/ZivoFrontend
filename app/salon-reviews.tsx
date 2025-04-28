import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const tabs = ['Hizmetler', 'Yorumlar', 'Portföy', 'Detaylar'];

const reviews = [
    {
        id: '1',
        name: 'Beyza Eprimez',
        rating: 3,
        date: '12.05.2024, 10:10',
        comment: 'Beklediğim kadar güzel değildi ama iyiydi. 3 yıldızı hak etti.',
    },
    {
        id: '2',
        name: 'Elif Ep',
        rating: 4,
        date: '21 Mart 2024, 15:22',
        comment: 'Gayet güzeldi ve 4 yıldız hak etti. Saç kesimi oldukça iyiydi.',
    },
    {
        id: '3',
        name: 'Fatmanur Ergen',
        rating: 5,
        date: '4 Şubat 2024, 22:40',
        comment: 'Çalışanlar ilgiliydi ve işlemden çok memnun kaldım.',
    },
    {
        id: '4',
        name: 'Zeynep Erdoğan',
        rating: 4,
        date: '2 Şubat 2024, 23:25',
        comment: 'Gayet iyiydi. Teşekkürler.',
    },
    {
        id: '5',
        name: 'Zehra Kum',
        rating: 5,
        date: '17 Ocak 2024, 13:17',
        comment: 'Jülide Hanıma saç kestirdim, çok memnun kaldım.',
    },
    {
        id: '6',
        name: 'Selenay Atcı',
        rating: 2,
        date: '10 Ocak 2024, 15:10',
        comment: 'İşlemden pek memnun kalmadım.',
    },
    {
        id: '7',
        name: 'Öznur Mantarcı',
        rating: 5,
        date: '4 Ocak 2024, 13:00',
        comment: 'Her şey çok güzeldi.',
    },
];

const totalReviews = 45000; // 🔥 Dinamik değerlendirme sayısı

export default function SalonReviewsScreen() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState('Yorumlar');
    const [selectedSort, setSelectedSort] = useState('Yeniden Eskiye');

    const handleTabPress = (tab: string) => {
        setSelectedTab(tab);
        if (tab === 'Hizmetler') router.push('/salon-services');
        if (tab === 'Yorumlar') { } // Buradayız zaten
        if (tab === 'Portföy') router.push('/salon-portfolio');
        if (tab === 'Detaylar') router.push('/salon-details');
    };
    const sortOptions = ['En İyi Değerlendirmeler', 'Yeniden Eskiye', 'Puana Göre'];

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
                    {tabs.map(tab => (
                        <TouchableOpacity key={tab} onPress={() => handleTabPress(tab)} style={styles.tabButton}>
                            <Text style={[styles.tabItem, selectedTab === tab && styles.activeTabItem]}>
                                {tab}
                            </Text>
                            {selectedTab === tab && <View style={styles.activeTabIndicator} />}
                        </TouchableOpacity>
                    ))}
                </View>

                {selectedTab === 'Yorumlar' && (
                    <>
                        {/* Ortalama Puan Kartı */}
                        <View style={styles.ratingCard}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.ratingNumber}>4,5<Text style={styles.outOfFive}>/5</Text></Text>
                                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <Ionicons key={i} name="star" size={18} color="black" />
                                    ))}
                                    <Ionicons name="star-half" size={18} color="black" />
                                </View>
                                <Text style={styles.totalReviews}>{totalReviews.toLocaleString()}+ Değerlendirmeler</Text>
                            </View>

                            {/* Progress Bars */}
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                {[5, 4, 3, 2, 1].map((star, index) => (
                                    <View key={index} style={styles.barRow}>
                                        <Text style={styles.starLabel}>{star}</Text>
                                        <View style={styles.barBackground}>
                                            <View style={[styles.barFill, { width: star === 5 ? '80%' : star === 4 ? '3%' : star === 3 ? '1%' : star === 2 ? '0%' : '16%' }]} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Filtre Başlığı */}
                        <Text style={styles.reviewTitle}>Değerlendirmeler</Text>

                        {/* Filtre Butonları */}
                        <View style={styles.filterButtons}>
                            {sortOptions.map(option => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.filterButton,
                                        selectedSort === option && styles.filterButtonActive,
                                    ]}
                                    onPress={() => setSelectedSort(option)}
                                >
                                    <Text
                                        style={[
                                            styles.filterButtonText,
                                            selectedSort === option && styles.filterButtonTextActive,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Kullanıcı Yorumları */}
                        <FlatList
                            data={reviews}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.reviewCard}>
                                    <View style={styles.reviewHeader}>
                                        <Ionicons name="person-circle-outline" size={40} color="black" />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={styles.userName}>{item.name}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Ionicons
                                                        key={i}
                                                        name={i < item.rating ? 'star' : 'star-outline'}
                                                        size={14}
                                                        color="black"
                                                    />
                                                ))}
                                            </View>
                                            <Text style={styles.reviewDate}>{item.date}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.commentText}>{item.comment}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
                        />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    tabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tabButton: {
        alignItems: 'center',
        flex: 1,
    },
    tabItem: {
        fontSize: 14,
        color: '#888',
    },
    activeTabItem: {
        fontWeight: 'bold',
        color: '#000',
    },
    activeTabIndicator: {
        width: '100%',
        height: 2,
        backgroundColor: '#000',
        marginTop: 4,
    },
    ratingCard: {
        flexDirection: 'row',
        margin: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderColor: '#eee',
        borderWidth: 1,
    },
    ratingNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    outOfFive: {
        fontSize: 18,
        fontWeight: 'normal',
    },
    totalReviews: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    starLabel: {
        width: 20,
        fontSize: 12,
        marginRight: 4,
        color: '#000',
    },
    barBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    barFill: {
        height: 8,
        backgroundColor: '#000',
        borderRadius: 4,
    },
    reviewTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 16,
        marginBottom: 8,
    },
    filterButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 16,
        marginBottom: 8,
    },
    filterButton: {
        backgroundColor: '#eee',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    filterButtonActive: {
        backgroundColor: '#000',
    },
    filterButtonText: {
        color: '#000',
        fontSize: 12,
    },
    filterButtonTextActive: {
        color: '#fff',
    },
    reviewCard: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userName: {
        fontWeight: 'bold',
        color: '#000',
    },
    reviewDate: {
        fontSize: 11,
        color: '#888',
        marginTop: 2,
    },
    commentText: {
        fontSize: 13,
        color: '#000',
    },
    sectionContainer: {
        padding: 16,
    },
    sectionText: {
        fontSize: 16,
        color: '#000',
    },
});