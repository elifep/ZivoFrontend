import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { useServiceStore } from '@/stores/serviceStore';
import { useLocalSearchParams } from 'expo-router'; // serviceId ve businessId parametreleri burada
import { generateTimeSlots } from '@/utils/time';
import Toast from 'react-native-toast-message';

export default function RandevuScreen() {
    const { create } = useAppointmentStore();
    const router = useRouter();
    const params = useLocalSearchParams();
    const serviceId = params.servicesId as string;
    const businessId = params.businessId as string;
    const { colors, isDark } = useAppTheme();
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>('irem');
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('2025-06-10');
    const [selectedTime, setSelectedTime] = useState<string>('11:30');
    const [note, setNote] = useState('');
    const { services } = useServiceStore();
    const service = services.find(s => s.servicesid === serviceId);
    // Örnek: servis süresi props ya da parametre ile geliyor olsun (örnek 30dk)
    useEffect(() => {
        const durationMin = 30;
        const times = generateTimeSlots("09:00", "18:00", durationMin);
        setAvailableTimes(times);
    }, []);
    const getEndTime = (startTime: string, durationMin: number): string => {
        const [hour, minute] = startTime.split(':').map(Number);
        const totalMinutes = hour * 60 + minute + durationMin;

        const endHour = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const endMin = (totalMinutes % 60).toString().padStart(2, '0');

        return `${endHour}:${endMin}`;
    };


    const handleConfirm = async () => {
        try {
            if (!serviceId || !businessId) {
                Toast.show({
                    type: 'error',
                    text1: 'Eksik Bilgi',
                    text2: 'Hizmet veya işletme bilgisi eksik.',
                });
                return;
            }

            const appointment_time = `${selectedDate}T${selectedTime}:00`;

            const staffIdToSend = selectedEmployee === null || selectedEmployee === 'farketmez' ? null : selectedEmployee;

            await create({
                businessId,
                servicesId: serviceId,
                staffId: staffIdToSend,
                appointment_time,
            });

            Toast.show({
                type: 'success',
                text1: 'Randevu Oluşturuldu',
                text2: 'Randevunuz başarıyla oluşturuldu.',
            });
            router.replace('/appointments');
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: err.message || 'Randevu oluşturulamadı.',
            });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} translucent={false} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <ScrollView style={{ padding: 16, paddingBottom: 100, backgroundColor: colors.background }}>

                    {/* Geri Butonu */}
                    <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                        <Text style={{ color: colors.text }}>Randevu AL</Text>
                    </TouchableOpacity>


                    {/* Çalışan Seçimi */}
                    <View style={styles.employeeRow}>
                        <TouchableOpacity
                            style={[
                                styles.farkEtmezButton,
                                {
                                    borderColor: selectedEmployee === null ? colors.primary : colors.softBorder,
                                    backgroundColor: selectedEmployee === null ? colors.primary : 'transparent',
                                },
                            ]}
                            onPress={() => setSelectedEmployee(null)}
                        >
                            <Text style={{
                                color: selectedEmployee === null ? colors.buttonText : colors.text, // ✅ seçildiyse açık tema yazı rengi
                                fontWeight: '500'
                            }}>
                                Fark Etmez
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedEmployee('irem')}>
                            <Ionicons name="person-circle" size={50} color={selectedEmployee === 'irem' ? 'blue' : colors.icon} />
                            <Text style={[styles.employeeLabel, { color: colors.text }]}>İrem Taş</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedEmployee('julide')}>
                            <Ionicons name="person-circle" size={50} color={selectedEmployee === 'julide' ? 'blue' : colors.icon} />
                            <Text style={[styles.employeeLabel, { color: colors.text }]}>Jülide Aslan</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Takvim */}
                    <Calendar
                        current={selectedDate}
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        theme={{
                            calendarBackground: colors.card,
                            backgroundColor: colors.card,
                            dayTextColor: colors.text,
                            monthTextColor: colors.text,
                            selectedDayBackgroundColor: colors.primary,
                            selectedDayTextColor: colors.background,
                            todayTextColor: isDark ? '#FFD700' : '#000',
                            arrowColor: colors.text,
                        }}
                        markedDates={{
                            [selectedDate]: { selected: true, marked: true, selectedColor: colors.primary },
                        }}
                        style={{ marginVertical: 16 }}
                    />

                    {/* Saat Seçimi */}
                    {/* Saatler - Scrollable */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12, paddingLeft: 16 }}>
                        {availableTimes.map((time) => (
                            <TouchableOpacity
                                key={time}
                                style={[
                                    styles.timeButton,
                                    selectedTime === time
                                        ? { backgroundColor: colors.text }
                                        : { backgroundColor: colors.card },
                                ]}
                                onPress={() => setSelectedTime(time)}
                            >
                                <Text style={{ color: selectedTime === time ? colors.background : colors.text }}>{time}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Seçilen Hizmet */}
                    <View style={[styles.serviceCard, { backgroundColor: colors.card }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.serviceTitle, { color: colors.text }]}>{service?.name || 'Hizmet'}</Text>
                            <View style={[{ flexDirection: 'column' }, { alignItems: 'flex-end' }]}>
                                <Text style={[styles.servicePrice, { color: colors.text }]}>{service?.price || '350'}₺</Text>
                                <Text style={{ color: colors.text, marginBottom: 4 }}>{selectedTime} - {getEndTime(selectedTime, service?.duration_min || 30)}</Text>
                            </View>
                        </View>

                        <View style={[styles.serviceLine, { backgroundColor: colors.softBorder }]} />

                        <View style={styles.employeeLine}>
                            <Text style={{ color: colors.text }}>
                                Çalışan: {selectedEmployee === null ? 'Fark Etmez' : selectedEmployee === 'julide' ? 'Jülide Aslan' : 'İrem Taş'}
                            </Text>
                            <TouchableOpacity style={styles.editButton} onPress={() => setShowStaffModal(true)}>
                                <Text style={{ fontSize: 12 }}>Değiştir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* + Hizmet Ekle */}
                    <TouchableOpacity style={styles.addService}>
                        <Ionicons name="add-outline" size={18} color={colors.text} />
                        <Text style={{ marginLeft: 6, color: colors.text }}>Hizmet Ekle</Text>
                    </TouchableOpacity>

                    {/* Not Bırak */}
                    <TouchableOpacity
                        onPress={() => setShowNoteModal(true)}
                        style={{
                            borderColor: colors.primary,
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            paddingVertical: 6,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 12,
                            width: '40%', // GENİŞLİK DÜZENLENDİ
                            gap: 6,
                        }}
                    >
                        <Ionicons name="chatbubble-outline" size={16} color={colors.text} />
                        <Text style={{ color: colors.text, marginLeft: 6 }}>Not Bırak</Text>
                    </TouchableOpacity>

                    {/* Not Bırak Modal */}
                    <Modal visible={showNoteModal} transparent animationType="fade">
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressOut={() => setShowNoteModal(false)}
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 24,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: colors.background,
                                    padding: 20,
                                    borderRadius: 12,
                                    width: '100%',
                                }}
                            >
                                <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                                    Not Bırak
                                </Text>
                                <TextInput
                                    placeholder="Örnek: Saçımı küt istiyorum"
                                    placeholderTextColor="#888"
                                    value={note}
                                    onChangeText={setNote}
                                    multiline
                                    style={{
                                        backgroundColor: colors.searchBackground,
                                        borderRadius: 8,
                                        padding: 12,
                                        height: 100,
                                        textAlignVertical: 'top',
                                        color: colors.text,
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNoteModal(false)}
                                    style={{
                                        marginTop: 16,
                                        backgroundColor: colors.primary,
                                        paddingVertical: 10,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: colors.background }}>Kaydet</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>

                    </Modal>
                    {/* Çalışan Seçimi Modalı */}
                    <Modal
                        visible={showStaffModal}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setShowStaffModal(false)}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPressOut={() => setShowStaffModal(false)}
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 24,
                            }}
                        >
                            <View style={{
                                backgroundColor: colors.card,
                                padding: 20,
                                borderRadius: 12,
                                width: '100%',
                                maxWidth: 300,
                            }}>
                                <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                                    Çalışan Seçin
                                </Text>

                                {[
                                    { id: null, name: 'Fark Etmez' },
                                    { id: 'irem', name: 'İrem Taş' },
                                    { id: 'julide', name: 'Jülide Aslan' }
                                ].map((staff) => (
                                    <TouchableOpacity
                                        key={staff.id ?? 'farketmez'}
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                            backgroundColor: selectedEmployee === staff.id ? colors.primary : colors.searchBackground,
                                            borderRadius: 6,
                                            marginBottom: 8,
                                        }}
                                        onPress={() => {
                                            setSelectedEmployee(staff.id);
                                            setShowStaffModal(false);
                                        }}
                                    >
                                        <Text style={{ color: selectedEmployee === staff.id ? colors.buttonText : colors.text }}>
                                            {staff.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    onPress={() => setShowStaffModal(false)}
                                    style={{
                                        marginTop: 10,
                                        alignSelf: 'flex-end',
                                    }}
                                >
                                    <Text style={{ color: colors.primary }}>Kapat</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                    {/* Alt Toplam ve Buton */}
                    <View style={styles.footer}>
                        <View>
                            <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>{service?.price || '350'}₺</Text>
                            <Text style={{ color: colors.mutedText }}>{service?.duration_min || '30'}dk</Text>
                        </View>
                        <TouchableOpacity style={[styles.confirmButton, { backgroundColor: colors.primary }]}
                            onPress={handleConfirm}>
                            <Text style={{ color: colors.buttonText, fontWeight: 'bold' }}>Randevuyu Onayla</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    employeeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 12,
    },
    farkEtmezButton: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    employeeLabel: {
        textAlign: 'center',
        marginTop: 4,
        fontSize: 12,
    },
    timeSlot: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
    serviceCard: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    serviceTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    servicePrice: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    employeeLine: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#eee',
        borderRadius: 6,
    },
    addService: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        width: '30%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    confirmButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    serviceLine: {
        height: 1,
    },
    timeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        marginRight: 8,
    },
});