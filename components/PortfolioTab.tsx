// PortfolioTab.js - Modal ve Yorum eklenmiş versiyon + Koyu Mod Desteği
import { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ImageSourcePropType } from 'react-native';

const portfolioItems = [
    { id: '1', image: require('@/assets/portfolio/1.png'), likes: 3, comments: 3 },
    { id: '2', image: require('@/assets/portfolio/2.png'), likes: 0, comments: 0 },
    { id: '3', image: require('@/assets/portfolio/3.png'), likes: 0, comments: 0 },
];

const mockComments = [
    { id: '1', user: 'Elif', text: 'Harika görünüyorsun!' },
    { id: '2', user: 'Zeynep', text: 'İnanılmaz bir sonuç 👏' },
    { id: '3', user: 'Fatma', text: 'Randevu almak için sabırsızlanıyorum.' },
];

export default function PortfolioTab() {
    const [selectedImage, setSelectedImage] = useState<ImageSourcePropType | null>(null);
    const [showComments, setShowComments] = useState(false);
    const { colors } = useAppTheme();

    return (
        <View style={{ padding: 16 }}>
            <FlatList
                data={portfolioItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: colors.card }]}>
                        <TouchableOpacity onPress={() => setSelectedImage(item.image)}>
                            <Image source={item.image} style={styles.image} />
                        </TouchableOpacity>
                        <View style={styles.overlay}>
                            <Ionicons name="share-outline" size={18} color={'#fff'} />
                            <View style={styles.overlayRight}>
                                <TouchableOpacity onPress={() => setShowComments(true)} style={styles.overlayGroup}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={18} color={'#fff'} />
                                    <Text style={[styles.overlayText, { color: '#fff' }]}>{item.comments}</Text>
                                </TouchableOpacity>
                                <View style={styles.overlayGroup}>
                                    <Ionicons name="heart-outline" size={18} color={'#fff'} />
                                    <Text style={[styles.overlayText, { color: '#fff' }]}>{item.likes}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                scrollEnabled={false}
            />

            {/* Modal: Image Fullscreen */}
            <Modal visible={!!selectedImage} transparent animationType="fade">
                <TouchableOpacity style={styles.modalContainer} onPress={() => setSelectedImage(null)}>
                    {selectedImage && (
                        <Image source={selectedImage} style={styles.modalImage} resizeMode="contain" />
                    )}
                </TouchableOpacity>
            </Modal>

            {/* Modal: Yorumlar */}
            <Modal visible={showComments} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.centeredModalBackground}
                    activeOpacity={1}
                    onPressOut={() => setShowComments(false)} // 🔥 dışa tıklayınca kapat
                >
                    <View style={[styles.commentModal, { backgroundColor: colors.background }]}>
                        <View style={styles.commentHeader}>
                            <Text style={[styles.commentTitle, { color: colors.text }]}>Yorumlar</Text>
                            <TouchableOpacity onPress={() => setShowComments(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={mockComments}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            renderItem={({ item }) => (
                                <View style={styles.commentCard}>
                                    <Ionicons name="person-circle-outline" size={30} color={colors.text} />
                                    <View style={{ marginLeft: 8 }}>
                                        <Text style={[styles.commentUser, { color: colors.text }]}>{item.user}</Text>
                                        <Text style={[styles.commentText, { color: colors.text }]}>{item.text}</Text>
                                    </View>
                                </View>
                            )}
                        />

                        {/* Yorum Yazma Alanı */}
                        <View style={styles.commentInputContainer}>
                            <TextInput
                                placeholder="Yorum yaz..."
                                placeholderTextColor="#888"
                                style={styles.commentInput}
                            />
                            <TouchableOpacity>
                                <Ionicons name="send" size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

// Style dosyasını değiştirmeye gerek yok çünkü dinamik renkler inline verildi.

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 16,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    overlayRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    overlayGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    overlayText: {
        color: '#fff',
        fontSize: 13,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '90%',
        height: '80%',
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    commentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    commentCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    commentUser: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentText: {
        fontSize: 13,
        color: '#333',
    },
    centeredModalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)', // Dış koyu bulanık arka plan
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentModal: {
        width: '90%',
        height: '70%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
    },
    commentInputContainer: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        gap: 8,
        borderRadius: 8,
    },
    commentInput: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        color: '#000',
    },
});