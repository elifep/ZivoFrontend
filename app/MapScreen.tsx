import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import { ActivityIndicator, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useBusinessStore } from '@/stores/businessStore';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function MapScreen() {
    const { location, requestLocation } = useLocationPermission(false); // konum izni yeniden istenmesin
    const { businesses } = useBusinessStore();
    const [radius, setRadius] = useState(5000); // metre
    const [radiusInput, setRadiusInput] = useState('5000'); // kullanıcı girişi için

    useEffect(() => {
        if (!location) {
            requestLocation(); // sadece 1 kez çağır
        }
    }, [location]);

    if (!location) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="black" />
                <Text>Fetching location...</Text>
            </View>
        );
    }
    // businesses.forEach((salon) => {
    //     if (!salon.latitude || !salon.longitude) {
    //         console.warn('❌ Missing coordinates:', salon.businessName, salon);
    //     }
    // });
    const router = useRouter();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>

                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    showsUserLocation
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    <Circle
                        center={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        radius={radius}
                        strokeColor="rgba(0, 122, 255, 0.4)"
                        fillColor="rgba(0, 122, 255, 0.1)"
                    />
                    {businesses
                        .filter(
                            (salon) =>
                                typeof salon.latitude === 'number' &&
                                typeof salon.longitude === 'number'
                        )
                        .map((salon) => (
                            <Marker
                                key={salon.businessId}
                                coordinate={{
                                    latitude: salon.latitude,
                                    longitude: salon.longitude,
                                }}
                                title={salon.businessName}
                                description={salon.adressline1}
                            />
                        ))}
                </MapView>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="black" />
                </TouchableOpacity>

                <View style={styles.controls}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Select Radius (meters):</Text>

                    <View style={styles.buttonRow}>
                        {[5000, 10000, 15000].map((r) => (
                            <TouchableOpacity
                                key={r}
                                onPress={() => {
                                    setRadius(r);
                                    setRadiusInput(String(r));
                                }}
                                style={[
                                    styles.radiusButton,
                                    radius === r && { backgroundColor: 'black' },
                                ]}
                            >
                                <Text style={{ color: radius === r ? 'white' : 'black' }}>{r / 1000} km</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        placeholder="Enter in meters (e.g., 800)"
                        value={radiusInput}
                        onChangeText={(val) => setRadiusInput(val)}
                        onSubmitEditing={() => {
                            const val = parseInt(radiusInput);
                            if (!isNaN(val) && val > 0) {
                                setRadius(val);
                            }
                        }}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    controls: {
        position: 'absolute',
        top: 70,
        right: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 12,
        width: 200,
        zIndex: 10,
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    radiusButton: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 16,
        backgroundColor: '#f2f2f2',
    },

    radiusButtonActive: {
        backgroundColor: 'black',
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 12,
    },

    backButton: {
        position: 'absolute', top: 50, left: 16, backgroundColor: '#fff', padding: 6, borderRadius: 20, zIndex: 10, // görünürlüğü artır
        elevation: 8, // Android için gölgelendirme     
    },
});