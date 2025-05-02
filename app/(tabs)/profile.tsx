import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, Dispatch, SetStateAction } from 'react';
import ThemePicker from '@/src/components/ThemePicker';
import LanguagePicker from '@/src/components/LanguagePicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { mockProfile } from '@/src/data/profile';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { StatusBar } from 'expo-status-bar';

// Alt Bileşenler
function ProfileInput({ label, value, onChangeText }: { label: string; value: string; onChangeText: (text: string) => void }) {
    const { colors } = useAppTheme();
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={[styles.label, { color: colors.icon }]}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={label}
                placeholderTextColor={colors.icon}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
            />
        </View>
    );
}

function ProfileDropdown({
    label, open, value, items, setOpen, onChangeValue, zIndex
}: {
    label: string;
    open: boolean;
    value: string;
    items: { label: string; value: string }[];
    setOpen: Dispatch<SetStateAction<boolean>>;
    onChangeValue: (val: string) => void;
    zIndex: number;
}) {
    const { colors } = useAppTheme();
    return (
        <View style={{ marginBottom: 16, zIndex }}>
            <Text style={[styles.label, { color: colors.icon }]}>{label}</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={(callback) => {
                    const val = callback(value);
                    onChangeValue(val);
                }}
                placeholder={label}
                style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
                textStyle={{ color: colors.text }}
                dropDownContainerStyle={{ backgroundColor: colors.card, borderColor: colors.border }}
                listMode="SCROLLVIEW"
            />
        </View>
    );
}
function ProfileScreen() {
    const { colors, isDark, theme } = useAppTheme();
    const { t } = useTranslation();

    const [profile, setProfile] = useState(mockProfile);

    const [cityOpen, setCityOpen] = useState(false);
    const [countryOpen, setCountryOpen] = useState(false);
    const [genderOpen, setGenderOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} translucent={false} />
            <KeyboardAwareScrollView
                contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
                extraScrollHeight={100}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                {/* Başlık */}
                <Text style={[styles.header, { color: colors.text }]}>
                    {t('profile.title') || 'Profil Bilgilerim'}
                </Text>

                {/* Profil Fotoğrafı */}
                <View style={styles.center}>
                    <Image source={{ uri: profile.image }} style={styles.profileImage} />
                </View>

                {/* Kart */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <ProfileInput
                        label="Ad Soyad"
                        value={profile.fullName}
                        onChangeText={(text) => setProfile({ ...profile, fullName: text })}
                    />
                    <ProfileInput
                        label="E-posta"
                        value={profile.email}
                        onChangeText={(text) => setProfile({ ...profile, email: text })}
                    />

                    {/* Tarih Seçimi */}
                    <Text style={[styles.label, { color: colors.icon }]}>Doğum Tarihi</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={[
                            styles.input,
                            { backgroundColor: colors.background, borderColor: colors.border, justifyContent: 'center' },
                        ]}
                    >
                        <Text style={{ color: profile.birthday ? colors.text : colors.icon }}>
                            {profile.birthday
                                ? format(new Date(profile.birthday), 'dd.MM.yyyy')
                                : 'Tarih Seçin'}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            mode="date"
                            value={profile.birthday ? new Date(profile.birthday) : new Date()}
                            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setProfile({ ...profile, birthday: selectedDate.toISOString() });
                                }
                            }}
                            {...(Platform.OS === 'ios' && { themeVariant: theme === 'dark' ? 'dark' : 'light' })}
                        />
                    )}

                    <ProfileInput
                        label="Telefon"
                        value={profile.phone}
                        onChangeText={(text) => setProfile({ ...profile, phone: text })}
                    />
                    <ProfileInput
                        label="Adres"
                        value={profile.address}
                        onChangeText={(text) => setProfile({ ...profile, address: text })}
                    />

                    {/* Dropdown Alanları */}
                    <ProfileDropdown
                        label="Şehir"
                        open={cityOpen}
                        value={profile.city}
                        items={[
                            { label: 'İstanbul', value: 'İstanbul' },
                            { label: 'Ankara', value: 'Ankara' },
                            { label: 'İzmir', value: 'İzmir' },
                        ]}
                        setOpen={(open) => {
                            setCityOpen(open);
                            if (open) {
                                setCountryOpen(false);
                                setGenderOpen(false);
                            }
                        }}
                        onChangeValue={(val) => setProfile({ ...profile, city: val })}
                        zIndex={3000}
                    />

                    <ProfileDropdown
                        label="Ülke"
                        open={countryOpen}
                        value={profile.country}
                        items={[
                            { label: 'Türkiye', value: 'Türkiye' },
                            { label: 'USA', value: 'USA' },
                            { label: 'Germany', value: 'Germany' },
                        ]}
                        setOpen={(open) => {
                            setCountryOpen(open);
                            if (open) {
                                setCityOpen(false);
                                setGenderOpen(false);
                            }
                        }}
                        onChangeValue={(val) => setProfile({ ...profile, country: val })}
                        zIndex={2000}
                    />

                    <ProfileDropdown
                        label="Cinsiyet"
                        open={genderOpen}
                        value={profile.gender}
                        items={[
                            { label: 'Erkek', value: 'Erkek' },
                            { label: 'Kadın', value: 'Kadın' },
                            { label: 'Diğer', value: 'Diğer' },
                        ]}
                        setOpen={(open) => {
                            setGenderOpen(open);
                            if (open) {
                                setCityOpen(false);
                                setCountryOpen(false);
                            }
                        }}
                        onChangeValue={(val) => setProfile({ ...profile, gender: val })}
                        zIndex={1000}
                    />
                </View>

                {/* Tema & Dil Seçimi */}
                <Text style={[styles.sectionTitle, { color: colors.icon }]}>Tema Seçimi</Text>
                <ThemePicker />

                <Text style={[styles.sectionTitle, { color: colors.icon }]}>Dil Seçimi</Text>
                <LanguagePicker />

                {/* Kaydet Butonu */}
                <TouchableOpacity style={[styles.saveButton, { borderColor: colors.primary }]}>
                    <Text style={[styles.saveButtonText, { color: colors.primary }]}>Kaydet</Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>
        </View>
    );
}
export default ProfileScreen;

// Stiller
const styles = StyleSheet.create({
    header: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    center: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 96,
        height: 96,
        borderRadius: 48,
        marginBottom: 8,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    label: {
        fontSize: 13,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
    },
    dropdown: {
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 20,
    },
    saveButton: {
        marginTop: 24,
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});