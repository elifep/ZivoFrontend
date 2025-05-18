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
import { TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ProfilimScreen() {
    const { colors } = useAppTheme();
    const { t } = useTranslation();
    const { profile, fetchProfile, updateProfile } = useProfileStore();
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);

    const [form, setForm] = useState({
        full_name: '',
        phone: '',
        birthday: '',
        gender: '',
        address: '',
        image: undefined as ImagePicker.ImagePickerAsset | undefined, // ✅
    });

    useEffect(() => {
        fetchProfile().catch((err) => {
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
            setForm((prev) => ({
                ...prev,
                image: result.assets[0], // 🔥 orijinal asset nesnesi
            }));
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
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'ios' ? 0 : 0 }}>
            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.title, { color: colors.text }]}>{t('profile.title')}</Text>
                <View style={{
                    padding: 16,
                }}>
                    <View style={{
                        backgroundColor: colors.card,
                        padding: 16,
                        borderRadius: 12,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 4,
                        marginBottom: 24
                    }}>
                        <View style={styles.imageContainer}>
                            {form.image || profile?.signed_url ? (
                                <TouchableOpacity onPress={() => setPreviewVisible(true)}>
                                    <Image source={{ uri: form.image?.uri || profile?.signed_url }} style={styles.image} />
                                    <TouchableOpacity onPress={pickImage} style={styles.imageEditIcon}>
                                        <Ionicons name="camera" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => setPreviewVisible(true)}>
                                    <TouchableOpacity onPress={pickImage} style={styles.imageEditIcon}>
                                        <Ionicons name="camera" size={22} color="#fff" />
                                    </TouchableOpacity>
                                    <Ionicons name="person-circle-outline" size={120} color={colors.icon} />
                                </TouchableOpacity>
                            )}
                        </View>


                        <TextInput
                            placeholder={t('profile.name')}
                            placeholderTextColor={colors.mutedText}
                            value={form.full_name}
                            onChangeText={(text) => setForm((f) => ({ ...f, full_name: text }))}
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        />
                        <TextInput
                            placeholder={t('profile.phone')}
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
                                <Picker.Item label={t('profile.selectGender')} value="" color={colors.mutedText} />
                                <Picker.Item label={t('profile.female')} value="Kadın" />
                                <Picker.Item label={t('profile.male')} value="Erkek" />
                                <Picker.Item label={t('profile.other')} value="Diğer" />
                            </Picker>
                        </View>

                        <TextInput
                            placeholder={t('profile.address')}
                            placeholderTextColor={colors.mutedText}
                            value={form.address}
                            onChangeText={(text) => setForm((f) => ({ ...f, address: text }))}
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        />
                        <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
                            <Text style={{ color: colors.buttonText }}>{t('profile.save')}</Text>
                        </TouchableOpacity>
                    </View>
                    {previewVisible && (// resim açılınca olan modal
                        <TouchableWithoutFeedback onPress={() => setPreviewVisible(false)}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <Image
                                        source={{ uri: form.image?.uri || profile?.signed_url }}
                                        style={styles.previewImage}
                                        resizeMode="contain"
                                    />

                                    <TouchableOpacity
                                        onPress={() => {
                                            setForm((prev) => ({ ...prev, image: undefined }));
                                            setPreviewVisible(false);
                                        }}
                                        style={styles.deleteIconBtn}
                                    >
                                        <Ionicons name="trash" size={28} color="#fff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={pickImage}
                                        style={styles.editIconBtn}
                                    >
                                        <Ionicons name="camera" size={28} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    <View style={{
                        backgroundColor: colors.card,
                        padding: 16,
                        borderRadius: 12,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 4,
                        marginBottom: 24
                    }}>
                        <View style={{
                            backgroundColor: colors.card,
                            padding: 12,
                            borderRadius: 10,
                            marginBottom: 20
                        }}>
                            <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 8 }}>
                                🌙 {t('Tema Seçimi')}
                            </Text>
                            <ThemePicker />
                        </View>

                        <View style={{
                            backgroundColor: colors.card,
                            padding: 12,
                            borderRadius: 10,
                            marginBottom: 20
                        }}>
                            <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 8 }}>
                                🌍 {t('Dil Seçimi')}
                            </Text>
                            <LanguagePicker />
                        </View>

                    </View>
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#e53935',
                            paddingVertical: 12,
                            borderRadius: 8,
                            marginTop: 10,
                            marginBottom: 20
                        }}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#fff', fontWeight: '600' }}>{t('Çıkış Yap')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        paddingVertical: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        alignContent: 'center',
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative', // ⬅ önemli
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: '#ccc',
        borderWidth: 2,
    },
    imageEditIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#000',
        borderRadius: 20,
        padding: 6,
        zIndex: 5,
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
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        elevation: 100,
    },
    modalContent: {
        alignItems: 'center',
        zIndex: 101,
    },
    previewImage: {
        width: 450,
        height: 550,
        borderRadius: 8,
        marginBottom: 20,
    },
    deleteIconBtn: {
        position: 'absolute',
        top: 10,
        right: 40,
        padding: 10,
        backgroundColor: '#e53935',
        borderRadius: 30,
        zIndex: 110,
    },
    editIconBtn: {
        position: 'absolute',
        top: 80,
        right: 40,
        padding: 10,
        backgroundColor: '#e53935',
        borderRadius: 30,
        zIndex: 110,
    },
});