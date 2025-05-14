import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { API_URL } from '@/config/config';

interface Props {
  image_url: string;
  businessName: string;
  adressline1: string;
  liked?: boolean;
  fullWidth?: boolean;
  onToggleLike?: () => void;
}

export default function SalonCard({
  image_url,
  businessName,
  adressline1,
  liked,
  fullWidth,
  onToggleLike,
}: Props) {
  const { colors } = useAppTheme();
  const screenWidth = Dimensions.get('window').width;

  const cardStyle = [
    styles.card,
    { backgroundColor: colors.card },
    fullWidth && { width: screenWidth - 32, marginRight: 0 },
  ];

  const imageSource = image_url?.startsWith('http')
    ? image_url
    : `${API_URL}/${image_url}`;

  return (
    <View style={cardStyle}>
      <View style={styles.imageWrapper}>
        {image_url ? (
          <Image source={{ uri: imageSource }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text style={{ color: '#000' }}>Resim Yok</Text>
          </View>
        )}

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

        <View style={[styles.ratingTopRight, { backgroundColor: colors.background }]}>
          <Feather name="star" size={14} color={colors.text} />
          <Text style={[styles.ratingText, { color: colors.text }]}>5.0</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{businessName}</Text>
        <Text style={[styles.address, { color: colors.icon }]} numberOfLines={1}>
          {adressline1}
        </Text>
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
  imageFallback: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 6,
    borderRadius: 20,
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
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
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
});