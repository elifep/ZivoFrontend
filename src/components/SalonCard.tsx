import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

interface Props {
  image_url: string;
  businessName: string;
  adressline1: string;
  liked?: boolean;
  fullWidth?: boolean;
  onToggleLike?: () => void;
  rating?: number;
}

export default function SalonCard({
  image_url,
  businessName,
  adressline1,
  liked,
  fullWidth,
  onToggleLike,
  rating
}: Props) {
  const { colors } = useAppTheme();
  const screenWidth = Dimensions.get('window').width;

  const isLiked = liked ?? false;

  const handleToggleLike = () => {
    if (onToggleLike) {
      onToggleLike();
    }
  };

  const cardStyle = [
    styles.card,
    { backgroundColor: colors.cardd },
    fullWidth && { width: screenWidth - 32, marginRight: 0 },
  ];

  return (
    <View style={cardStyle}>
      <View style={styles.imageWrapper}>

        <Image
          source={
            image_url && image_url.startsWith('http')
              ? { uri: image_url }
              : require('../../assets/images/salons/defaultimage.png')
          }
          style={styles.image}
        />

        <TouchableOpacity
          style={[styles.heart, { backgroundColor: colors.background }]}
          onPress={handleToggleLike}
        >
          {isLiked ? (
            <FontAwesome name="heart" size={18} color={colors.primary} />
          ) : (
            <Feather name="heart" size={18} color={colors.icon} />
          )}
        </TouchableOpacity>

        <View style={[styles.ratingTopRight, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Feather name="star" size={15} color={colors.text} />
          <Text style={[styles.ratingText, { color: colors.text }]}>
            {rating?.toFixed(1) ?? '0.0'}
          </Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{businessName}</Text>
        <Text style={[styles.address, { color: colors.icon }]} numberOfLines={2}>
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
    elevation: 5,
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
    padding: 10, // artırıldı
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