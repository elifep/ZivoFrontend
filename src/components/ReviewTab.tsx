import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Image, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useReviewStore } from '@/stores/reviewStore';
import { useProfileStore } from '@/stores/profileStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { jwtDecode } from 'jwt-decode';
import { Modal } from 'react-native';

export const getUserIdFromToken = async (): Promise<string | null> => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) return null;

    try {
        const decoded: any = jwtDecode(token);
        return decoded.userId || null;
    } catch (error) {
        console.error('Token çözümlenemedi:', error);
        return null;
    }
};
const sortOptions = ['Recommended', 'Newest First', 'By Rating', 'Oldest First'];

interface DisplayReview {
    id: string;
    userId: string;
    name: string;
    avatar?: string | null;
    rating: number;
    date: string;
    comment: string;
}
interface ReviewTabProps {
    salonData: {
        businessId: string;
        businessName: string;
        image_url?: string;
        adressline1?: string;
        // ihtiyaca göre diğer alanlar
    };
}
export default function ReviewTab({ salonData }: ReviewTabProps) {
    const { colors } = useAppTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const businessId = salonData.businessId;
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [selectedSort, setSelectedSort] = useState('	Newest First');
    const { average, total, fetchReviews, addReview } = useReviewStore();
    const { profile, fetchProfile } = useProfileStore();
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [businessReviews, setBusinessReviews] = useState<DisplayReview[]>([]);
    const { removeReview, editReview } = useReviewStore();
    const [selectedToDelete, setSelectedToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);
    useEffect(() => {
        getUserIdFromToken().then((id) => setCurrentUserId(id));

        if (!businessId) return;

        fetchReviews(businessId).then(() => {
            const reviewState = useReviewStore.getState().reviews;
            const formatted = reviewState.map((r) => ({
                id: r.reviewsId,
                userId: r.userId,
                name: r.user?.full_name || 'Kullanıcı',
                avatar: r.user?.image_url || null,
                rating: r.rating,
                date: new Date(r.created_at || '').toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                comment: r.comment || ''
            }));

            // Sıralama işlemi
            const sorted = [...formatted].sort((a, b) => {
                if (selectedSort === 'Newest First') {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                } else if (selectedSort === 'By Rating') {
                    return b.rating - a.rating;
                } else if (selectedSort === 'Recommended') {
                    if (b.rating !== a.rating) return b.rating - a.rating;
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                } else if (selectedSort === 'Oldest First') {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                }
                return 0;
            });

            // Kendi yorumunu en üste alma
            const prioritized = [...sorted].sort((a, b) => {
                if (a.userId === currentUserId) return -1;
                if (b.userId === currentUserId) return 1;
                return 0;
            });

            setBusinessReviews(prioritized);
        });
    }, [businessId, selectedSort]);

    const handleDelete = async (reviewId: string) => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) throw new Error('No authorization token found');

            await removeReview(token, reviewId);
            Toast.show({ type: 'success', text1: 'Review deleted!' });

            await fetchReviews(businessId);
            const updatedReviews = useReviewStore.getState().reviews;
            const formatted = updatedReviews.map((r) => ({
                id: r.reviewsId,
                userId: r.userId,
                name: r.user?.full_name || 'Kullanıcı',
                avatar: r.user?.image_url || null,
                rating: r.rating,
                date: new Date(r.created_at || '').toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                comment: r.comment || '',
            }));
            setBusinessReviews(formatted);
        } catch (err: any) {
            Toast.show({ type: 'error', text1: 'Could not delete', text2: err.message });
        }
    };

    const handleSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) throw new Error('No authorization token found');
            if (!businessId) throw new Error('No business found.');

            if (isEditing && editingId) {
                await editReview(token, editingId, rating, comment);
                Toast.show({ type: 'success', text1: '	Review updated!' });
            } else {
                await addReview(token, businessId, rating, comment);
                Toast.show({ type: 'success', text1: '	Review submitted!' });
            }

            setRating(0);
            setComment('');
            setIsEditing(false);
            setEditingId(null);

            await fetchReviews(businessId);
            const updatedReviews = useReviewStore.getState().reviews;
            const formatted = updatedReviews.map((r) => ({
                id: r.reviewsId,
                userId: r.userId,
                name: r.user?.full_name || 'Kullanıcı',
                avatar: r.user?.image_url || null,
                rating: r.rating,
                date: new Date(r.created_at || '').toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                comment: r.comment || '',
            }));
            setBusinessReviews(formatted);

        } catch (err: any) {
            Toast.show({ type: 'error', text1: 'Operation failed', text2: err.message });
        }
    };

    return (
        <View style={[{ padding: 16 }, { backgroundColor: colors.background }, { flex: 1, position: 'relative' }]}>
            {/* Ortalama Puan Kutusu */}
            <View style={styles.ratingBox}>
                <View style={styles.ratingRow}>
                    <Text style={styles.ratingNumber}>
                        {average.toFixed(1)}<Text style={styles.outOfFive}>/5</Text>
                    </Text>
                    <View style={styles.starsContainer}>
                        {[...Array(5)].map((_, i) => (
                            <Ionicons
                                key={i}
                                name={i < Math.floor(average) ? 'star' : i < average ? 'star-half' : 'star-outline'}
                                size={24}
                                color="#000"
                            />
                        ))}
                    </View>
                </View>
                <Text style={styles.totalReviews}>{total.toLocaleString()}+ Reviews</Text>
            </View>

            {/* Yorum Ekleme Kutusu */}
            <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                    <Image
                        source={
                            profile?.signed_url
                                ? { uri: profile.signed_url }
                                : profile?.image_url
                                    ? { uri: profile.image_url }
                                    : require('../../assets/images/salons/defaultimage.png')
                        }
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            borderWidth: profile?.image_url ? 0 : 1,
                            borderColor: '#ccc'
                        }}
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.userName}>{profile?.full_name || 'Kullanıcı'}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                                    <Ionicons
                                        name={i <= rating ? 'star' : 'star-outline'}
                                        size={14}
                                        color={i <= rating ? 'orange' : 'gray'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
                <TextInput
                    placeholder="Write your review here..."
                    multiline
                    numberOfLines={3}
                    value={comment}
                    onChangeText={setComment}
                    style={{
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 10,
                        marginBottom: 10,
                        backgroundColor: '#fff'
                    }}
                />
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{
                        backgroundColor: '#000',
                        padding: 10,
                        borderRadius: 8,
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ color: '#fff' }}>Submit</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text style={styles.reviewTitle}>Reviews</Text>
                <View style={styles.extraButtons}>
                    <TouchableOpacity style={[styles.button, { borderColor: colors.border }]}>
                        <Feather name="sliders" size={16} color={colors.text} />
                        <Text style={[styles.buttonText, { color: colors.text }]}>Filter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { borderColor: colors.border }]}
                        onPress={() => {
                            // Açılır menü ya da modal ile sıralama seçimi yapılabilir
                            // örnek: setShowSortModal(true)
                        }}
                    >
                        <Feather name="list" size={16} color={colors.text} />
                        <Text style={[styles.buttonText, { color: colors.text }]}>Sort by: Recommended</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterButtons}
            >
                {sortOptions.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.filterButton,
                            selectedSort === option && styles.filterButtonActive
                        ]}
                        onPress={() => setSelectedSort(option)}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                selectedSort === option && styles.filterButtonTextActive
                            ]}
                        >
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Yorumlar Listesi */}
            <FlatList
                data={businessReviews}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Image
                                source={
                                    item.avatar ? { uri: item.avatar } : require('../../assets/images/salons/defaultimage.png')
                                }
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    borderWidth: item.avatar ? 0 : 1,
                                    borderColor: '#ccc'
                                }}
                            />
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
                        {/* ✏️ Kullanıcıya özel düzenle/sil butonları */}
                        {currentUserId === item.userId && (
                            <View style={styles.actionButtonsWrapper}>
                                <TouchableOpacity onPress={() => {
                                    setComment(item.comment);
                                    setRating(item.rating);
                                    setIsEditing(true);
                                    setEditingId(item.id);
                                }} style={styles.actionButton}>
                                    <Ionicons name="create-outline" size={16} color="#666" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setSelectedToDelete(item.id)} style={styles.actionButton}>
                                    <Ionicons name="trash-outline" size={16} color="#e74c3c" />
                                </TouchableOpacity>
                            </View>
                        )}

                    </View>
                )}
                scrollEnabled={false}
                contentContainerStyle={{ paddingTop: 10 }}
            />
            {selectedToDelete && (

                <Modal
                    visible={!!selectedToDelete}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSelectedToDelete(null)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>Are you sure you want to delete this review?</Text>
                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.modalButtonYes}
                                    onPress={() => {
                                        handleDelete(selectedToDelete);
                                        setSelectedToDelete(null);
                                    }}
                                >
                                    <Text style={{ color: '#fff' }}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalButtonNo}
                                    onPress={() => setSelectedToDelete(null)}
                                >
                                    <Text style={{ color: '#000' }}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    actionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    filterButtons: {
        flexDirection: 'row',
        gap: 8,
    },

    extraButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },

    buttonText: {
        marginLeft: 6,
        fontSize: 13,
    }
    ,
    actionButtonsWrapper: {
        position: 'absolute',
        top: 6,
        right: 6,
        flexDirection: 'row',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.85)',
        padding: 4,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    actionButton: {
        padding: 2,
    },
    ratingBox: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 12,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8
    },
    ratingNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000'
    },
    outOfFive: {
        fontSize: 16,
        fontWeight: '400',
        color: '#888'
    },
    starsContainer: {
        flexDirection: 'row'
    },
    totalReviews: {
        fontSize: 12,
        marginTop: 6,
        color: '#666',
        textAlign: 'center'
    },
    reviewCard: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    userName: {
        fontWeight: 'bold',
        color: '#000'
    },
    reviewDate: {
        fontSize: 11,
        color: '#888',
        marginTop: 2
    },
    commentText: {
        fontSize: 13,
        color: '#000'
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12
    },
    sortButtonText: {
        fontSize: 12,
        color: '#666'
    },
    filterButton: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginTop: 6,
        backgroundColor: '#eee',
    },
    filterButtonActive: {
        backgroundColor: '#000',
    },
    filterButtonText: {
        color: '#555',
        fontSize: 13,
    },
    filterButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    reviewTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    modalBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButtonYes: {
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    modalButtonNo: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
});