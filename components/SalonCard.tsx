import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

interface Props {
    image: any;
    name: string;
    address: string;
    rating: number;
    liked?: boolean;
    discount?: string;
    fullWidth?: boolean;
    onToggleLike?: () => void;
    mostLiked?: boolean;
    isCampaign?: boolean;
}

export default function SalonCard({
    image,
    name,
    address,
    rating,
    liked,
    discount,
    fullWidth,
    onToggleLike,
    mostLiked,
    isCampaign,
}: Props) {
    const { colors } = useAppTheme();
    const screenWidth = Dimensions.get('window').width;

    const cardStyle = [
        styles.card,
        { backgroundColor: colors.card },
        fullWidth && { width: screenWidth - 32, marginRight: 0 },
    ];

    return (
        <View style={cardStyle}>
            <View style={styles.imageWrapper}>
                <Image source={image} style={styles.image} />

                {/* Favori ikonu */}
                <TouchableOpacity
                    style={[styles.heart, { backgroundColor: colors.background }]}
                    onPress={onToggleLike}
                >
                    {liked ? (
                        <FontAwesome name="heart" size={18} color={colors.primary} />
                    ) : (
                        <Feather name="heart" size={18} color={colors.icon} />
                    )}
                </TouchableOpacity>

                {/* Üst sağ köşe içerikleri */}
                {isCampaign ? (
                    discount && (
                        <View style={[styles.discountTag, { backgroundColor: colors.primary }]}>
                            <Feather name="tag" size={12} color={colors.background} style={{ marginRight: 4 }} />
                            <Text style={[styles.discountText, { color: colors.background }]}>{discount}</Text>
                        </View>
                    )
                ) : (
                    <View style={[styles.ratingTopRight, { backgroundColor: colors.background }]}>
                        <Feather name="star" size={14} color={colors.text} />
                        <Text style={[styles.ratingText, { color: colors.text }]}>{rating.toFixed(1)}</Text>
                    </View>
                )}
            </View>

            {/* Alt bilgi alanı */}
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
                <Text style={[styles.address, { color: colors.icon }]} numberOfLines={1}>
                    {address}
                </Text>

                {/* Sadece kampanyalarda alt bilgi görünür */}
                {isCampaign && (
                    <View style={styles.ratingRow}>
                        <View style={[styles.ratingBox, { borderColor: colors.border }]}>
                            <Feather name="star" size={14} color={colors.text} />
                            <Text style={[styles.ratingText, { color: colors.text }]}>{rating.toFixed(1)}</Text>
                        </View>

                        {mostLiked && (
                            <View style={[styles.badgeBox, { borderColor: colors.border }]}>
                                <Feather name="trending-up" size={12} color={colors.text} style={{ marginRight: 4 }} />
                                <Text style={[styles.badgeText, { color: colors.text }]}>3 günde en çok beğenilen</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 260,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageWrapper: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 160,
    },
    heart: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 6,
        borderRadius: 20,
    },
    discountTag: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    discountText: {
        fontSize: 12,
        fontWeight: '600',
    },
    info: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    address: {
        fontSize: 13,
        marginBottom: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '600',
    },
    badgeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 11,
    },
    ratingTopRight: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
});