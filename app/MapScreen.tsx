import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                showsUserLocation
                initialRegion={{
                    latitude: 38.73,
                    longitude: 35.48,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{ latitude: 38.73, longitude: 35.48 }}
                    title="Salon Adı"
                    description="Adres bilgisi"
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    map: {
        flex: 1,
    },
});