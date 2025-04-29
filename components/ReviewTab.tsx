import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';

const reviews = [
    { id: '1', name: 'Beyza Eprimez', rating: 3, date: '12.05.2024, 10:10', comment: 'Beklediğim kadar güzel değildi ama iyiydi. 3 yıldızı hak etti.' },
    { id: '2', name: 'Elif Ep', rating: 4, date: '21 Mart 2024, 15:22', comment: 'Gayet güzeldi ve 4 yıldız hak etti. Saç kesimi oldukça iyiydi.' },
    { id: '3', name: 'Fatmanur Ergen', rating: 5, date: '4 Şubat 2024, 22:40', comment: 'Çalışanlar ilgiliydi ve işlemden çok memnun kaldım.' },
    { id: '4', name: 'Zeynep Erdoğan', rating: 4, date: '2 Şubat 2024, 23:25', comment: 'Gayet iyiydi. Teşekkürler.' },
    { id: '5', name: 'Zehra Kum', rating: 5, date: '17 Ocak 2024, 13:17', comment: 'Jülide Hanıma saç kestirdim, çok memnun kaldım.' },
    { id: '6', name: 'Selenay Atcı', rating: 2, date: '10 Ocak 2024, 15:10', comment: 'İşlemden pek memnun kalmadım.' },
    { id: '7', name: 'Öznur Mantarcı', rating: 5, date: '4 Ocak 2024, 13:00', comment: 'Her şey çok güzeldi.' },
];

const totalReviews = 45000;
const sortOptions = ['En İyi Değerlendirmeler', 'Yeniden Eskiye', 'Puana Göre'];

export default function ReviewTab() {
    const [selectedSort, setSelectedSort] = useState('Yeniden Eskiye');

    return (
        <View style={{ padding: 16 }}>
            {/* Ortalama Puan */}
            <ImageBackground
                source={require('@/assets/stars.jpg')}
                style={styles.ratingCard}
                imageStyle={{ borderRadius: 12 }}
            >
                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12 }} />

                {/* İçerikler */}
                <View style={{ padding: 16, alignItems: 'center' }}>
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingNumber}>
                            4,5<Text style={styles.outOfFive}>/5</Text>
                        </Text>

                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4].map((i) => (
                                <Ionicons key={i} name="star" size={32} color="#fff" />
                            ))}
                            <Ionicons name="star-half" size={32} color="#fff" />
                        </View>
                    </View>

                    <Text style={styles.totalReviews}>{totalReviews.toLocaleString()}+ Değerlendirme</Text>
                </View>
            </ImageBackground>

            {/* Filtre Butonları */}
            <Text style={styles.reviewTitle}>Değerlendirmeler</Text>
            <View style={styles.filterButtons}>
                {sortOptions.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.filterButton, selectedSort === option && styles.filterButtonActive]}
                        onPress={() => setSelectedSort(option)}
                    >
                        <Text style={[styles.filterButtonText, selectedSort === option && styles.filterButtonTextActive]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Yorum Listesi */}
            <FlatList
                data={reviews}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Ionicons name="person-circle-outline" size={40} color="black" />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.userName}>{item.name}</Text>
                                <View style={{ flexDirection: 'row' }}>
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
                contentContainerStyle={{ paddingTop: 10 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    ratingCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderColor: '#eee',
        borderWidth: 1,
        marginBottom: 16,
        alignItems: 'center',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingNumber: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 12,
    },
    outOfFive: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#fff',   // beyaz oldu
    },
    starsContainer: {
        flexDirection: 'row',
    },
    totalReviews: {
        fontSize: 12,
        marginTop: 8,
        color: '#ddd',   // açık beyazımsı oldu
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
        marginBottom: 8,
        color: '#000',
    },
    filterButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
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
        fontSize: 12,
        color: '#000',
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
});