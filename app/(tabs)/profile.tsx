// src/app/(tabs)/profil.tsx
import { View, Button, Text, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '@/stores/profileStore';
import { useAuthStore } from '@/stores/authStore';
import Toast from 'react-native-toast-message';
import ThemePicker from '@/components/ThemePicker';
import LanguagePicker from '@/components/LanguagePicker';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

export default function ProfilimScreen() {
    const { colors } = useAppTheme();
    const { profile, fetchProfile, updateProfile } = useProfileStore();
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [form, setForm] = useState({
        full_name: '',
        phone: '',
        birthday: '',
        gender: '',
        address: '',
        image: undefined as (File & { uri: string }) | undefined,
    });

    useEffect(() => {
        fetchProfile().then(() => {
            console.log('Profil çekildi:', useProfileStore.getState().profile);
        }).catch((err) => {
            Toast.show({ type: 'error', text1: 'Profil yüklenemedi', text2: err.message });
        });
    }, []);

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

    const handleLogout = async () => {
        await logout();
        Alert.alert('Çıkış Yapıldı');
        router.replace('/auth/login');
    };

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
            await updateProfile(form);
            Toast.show({ type: 'success', text1: 'Profil güncellendi' });
        } catch (err: any) {
            Toast.show({ type: 'error', text1: 'Hata', text2: err.message });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.title, { color: colors.text }]}>Profilim</Text>

                <View style={styles.imageContainer}>
                    {form.image ? (
                        <Image source={{ uri: form.image.uri }} style={styles.image} />
                    ) : profile?.image_url ? (
                        <Image source={{ uri: `http://10.0.2.2:5000/${profile.image_url}` }} style={styles.image} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={120} color={colors.icon} />
                    )}
                    <TouchableOpacity onPress={pickImage} style={[styles.pickBtn, { backgroundColor: colors.primary }]}>
                        <Text style={{ color: colors.buttonText }}>Fotoğrafı Değiştir</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder="Ad Soyad"
                    placeholderTextColor={colors.mutedText}
                    value={form.full_name}
                    onChangeText={(text) => setForm((f) => ({ ...f, full_name: text }))}
                    style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                />
                <TextInput
                    placeholder="Telefon"
                    placeholderTextColor={colors.mutedText}
                    value={form.phone}
                    onChangeText={(text) => setForm((f) => ({ ...f, phone: text }))}
                    keyboardType="phone-pad"
                    style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, { borderColor: colors.border }]}>
                    <Text style={{ color: form.birthday ? colors.text : colors.mutedText }}>
                        {form.birthday ? moment(form.birthday).format('DD.MM.YYYY') : 'Doğum Tarihi Seç'}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={form.birthday ? new Date(form.birthday) : new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                const dateString = selectedDate.toISOString().split('T')[0];
                                setForm((f) => ({ ...f, birthday: dateString }));
                            }
                        }}
                    />
                )}

                <View style={[styles.input, { borderColor: colors.border }, { padding: 0 }]}>
                    <Picker
                        selectedValue={form.gender}
                        onValueChange={(itemValue) => setForm((f) => ({ ...f, gender: itemValue }))}
                        style={{ color: colors.text }}
                        dropdownIconColor={colors.icon}
                    >
                        <Picker.Item label="Cinsiyet Seçin" value="" color={colors.mutedText} />
                        <Picker.Item label="Kadın" value="Kadın" />
                        <Picker.Item label="Erkek" value="Erkek" />
                        <Picker.Item label="Diğer" value="Diğer" />
                    </Picker>
                </View>

                <TextInput
                    placeholder="Adres"
                    placeholderTextColor={colors.mutedText}
                    value={form.address}
                    onChangeText={(text) => setForm((f) => ({ ...f, address: text }))}
                    style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                />

                <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
                    <Text style={{ color: colors.buttonText }}>KAYDET</Text>
                </TouchableOpacity>

                <Text style={[styles.sectionTitle, { color: colors.icon }]}>Tema Seçimi</Text>
                <ThemePicker />

                <Text style={[styles.sectionTitle, { color: colors.icon }]}>Dil Seçimi</Text>
                <LanguagePicker />

                <View style={{ marginTop: 20 }}>
                    <Button title="Çıkış Yap" onPress={handleLogout} color="#e53935" />
                </View>
            </ScrollView>
        </SafeAreaView>
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
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    pickBtn: {
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
    saveBtn: {
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 24,
    },
});