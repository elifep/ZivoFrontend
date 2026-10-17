import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

export function useLocationPermission(autoRequest = true) {
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [granted, setGranted] = useState<boolean>(false);
    useEffect(() => {
        console.log('📍 useEffect - location:', location);
    }, [location]);

    useEffect(() => {
        if (autoRequest) {
            requestLocation();
        }
    }, []);

    const requestLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Toast.show({
                    type: 'error',
                    text1: 'Konum izni reddedildi',
                    text2: 'Yakınındaki salonları görebilmek için konum izni vermelisin.',
                });
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            console.log('📍 Konum alındı:', loc);
            setLocation(loc.coords);
            setGranted(true);
        } catch (err) {
            console.error('Konum alma hatası:', err);
        }
    };

    return { location, granted, requestLocation };
}