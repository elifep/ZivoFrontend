// PortfolioTab.js - Modal ve Yorum eklenmiş versiyon
import { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const portfolioItems = [
    { id: '1', image: require('@/assets/portfolio/1.png'), likes: 0, comments: 0 },
    { id: '2', image: require('@/assets/portfolio/2.png'), likes: 0, comments: 0 },
    { id: '3', image: require('@/assets/portfolio/3.png'), likes: 0, comments: 0 },
];

const mockComments = [
    { id: '1', user: 'Elif', text: 'Harika görünüyorsun!' },
    { id: '2', user: 'Zeynep', text: 'İnanılmaz bir sonuç 👏' },
    { id: '3', user: 'Fatma', text: 'Randevu almak için sabırsızlanıyorum.' },
];

export default function PortfolioTab() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showComments, setShowComments] = useState(false);

    return (
        <View style={{ padding: 16 }}>
            <FlatList
                data={portfolioItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => setSelectedImage(item.image)}>
                            <Image source={item.image} style={styles.image} />
                        </TouchableOpacity>
                        <View style={styles.overlay}>
                            <Ionicons name="share-outline" size={18} color="#fff" />
                            <View style={styles.overlayRight}>
                                <TouchableOpacity onPress={() => setShowComments(true)} style={styles.overlayGroup}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" />
                                    <Text style={styles.overlayText}>{item.comments}</Text>
                                </TouchableOpacity>
                                <View style={styles.overlayGroup}>
                                    <Ionicons name="heart-outline" size={18} color="#fff" />
                                    <Text style={styles.overlayText}>{item.likes}</Text>
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
                    <Image source={selectedImage} style={styles.modalImage} resizeMode="contain" />
                </TouchableOpacity>
            </Modal>

            {/* Modal: Yorumlar */}
            <Modal visible={showComments} animationType="slide">
                <View style={styles.commentModal}>
                    <View style={styles.commentHeader}>
                        <Text style={styles.commentTitle}>Yorumlar</Text>
                        <TouchableOpacity onPress={() => setShowComments(false)}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={mockComments}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.commentCard}>
                                <Ionicons name="person-circle-outline" size={30} color="#000" />
                                <View style={{ marginLeft: 8 }}>
                                    <Text style={styles.commentUser}>{item.user}</Text>
                                    <Text style={styles.commentText}>{item.text}</Text>
                                </View>
                            </View>
                        )}
                    />
                    <View style={styles.commentInputContainer}>
                        <TextInput placeholder="Yorum yaz..." style={styles.commentInput} />
                        <TouchableOpacity>
                            <Ionicons name="send" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

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
    commentModal: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 80, // ekranın üst kısmından boşluk bırakıldı
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
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
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    commentInput: {
        flex: 1,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f3f3f3',
        marginRight: 8,
    },
});