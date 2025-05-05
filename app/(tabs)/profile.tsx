import { View, Text, TextInput, Button, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '@/src/stores/profileStore';
import { useAuthStore } from '@/src/stores/authStore';
import Toast from 'react-native-toast-message';
import ThemePicker from '@/src/components/ThemePicker';
import LanguagePicker from '@/src/components/LanguagePicker';

export default function ProfilimScreen() {
    const token = useAuthStore((s) => s.accessToken);
    const { profile, fetchProfile, updateProfile } = useProfileStore();

    const [form, setForm] = useState({
        full_name: '',
        phone: '',
        birthday: '',
        gender: '',
        address: '',
        image: undefined as (File & { uri: string }) | undefined,
    });

    useEffect(() => {
        if (token) {
            fetchProfile(token);
        }
    }, [token]);

    useEffect(() => {
        if (profile) {
            setForm({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                birthday: profile.birthday || '',
                gender: profile.gender || '',
                address: profile.address || '',
                image: undefined,
            });
        }
    }, [profile]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
            const selected = result.assets[0];
            const file = {
                uri: selected.uri,
                name: selected.uri.split('/').pop() || 'image.jpg',
                type: 'image/jpeg',
            } as File & { uri: string };

            setForm((prev) => ({ ...prev, image: file }));
        }
    };

    const handleSave = async () => {
        try {
            await updateProfile(form, token!);
            Toast.show({
                type: 'success',
                text1: 'Profil güncellendi',
            });
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: err.message,
            });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Profilim</Text>

            <TextInput
                placeholder="Ad Soyad"
                value={form.full_name}
                onChangeText={(text) => setForm((f) => ({ ...f, full_name: text }))}
                style={styles.input}
            />
            <TextInput
                placeholder="Telefon"
                value={form.phone}
                onChangeText={(text) => setForm((f) => ({ ...f, phone: text }))}
                keyboardType="phone-pad"
                style={styles.input}
            />
            <TextInput
                placeholder="Doğum Tarihi (YYYY-MM-DD)"
                value={form.birthday}
                onChangeText={(text) => setForm((f) => ({ ...f, birthday: text }))}
                style={styles.input}
            />
            <TextInput
                placeholder="Cinsiyet"
                value={form.gender}
                onChangeText={(text) => setForm((f) => ({ ...f, gender: text }))}
                style={styles.input}
            />
            <TextInput
                placeholder="Adres"
                value={form.address}
                onChangeText={(text) => setForm((f) => ({ ...f, address: text }))}
                style={styles.input}
            />

            {form.image ? (
                <Image source={{ uri: form.image.uri }} style={styles.imagePreview} />
            ) : profile?.image_url ? (
                <Image source={{ uri: `http://localhost:5000/${profile.image_url}` }} style={styles.imagePreview} />
            ) : null}

            <TouchableOpacity onPress={pickImage} style={styles.pickBtn}>
                <Text style={{ color: '#fff' }}>Fotoğraf Seç</Text>
            </TouchableOpacity>

            <Button title="Kaydet" onPress={handleSave} />

            {/* Tema & Dil Seçimi */}
            <Text style={styles.sectionTitle}>Tema Seçimi</Text>
            <ThemePicker />

            <Text style={styles.sectionTitle}>Dil Seçimi</Text>
            <LanguagePicker />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 16,
        borderRadius: 10,
    },
    pickBtn: {
        backgroundColor: '#000',
        padding: 12,
        alignItems: 'center' as const,
        borderRadius: 6,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 24,
    },
});