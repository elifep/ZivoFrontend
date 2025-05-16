import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, FlatList, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function EditAppointmentScreen() {
    const router = useRouter();
    const { colors, isDark } = useAppTheme();
    const [showNoteModal, setShowNoteModal] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState<string | null>('irem');
    const [selectedDate, setSelectedDate] = useState<string>('2025-06-10');
    const [selectedTime, setSelectedTime] = useState<string>('11:30');
    const [note, setNote] = useState('');

    const times = [
        '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30',
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>

                {/* Geri Butonu */}
                <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                    <Text style={{ color: colors.text }}>Randevularım</Text>
                </TouchableOpacity>


                {/* Çalışan Seçimi */}
                <View style={styles.employeeRow}>
                    <TouchableOpacity style={[styles.farkEtmezButton, { borderColor: colors.softBorder }]}><Text style={{ color: colors.text }}>Fark Etmez</Text></TouchableOpacity>
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
                    {times.map((time) => (
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
                        <Text style={[styles.serviceTitle, { color: colors.text }]}>Manikür</Text>
                        <View style={[{ flexDirection: 'column' }, { alignItems: 'flex-end' }]}>
                            <Text style={[styles.servicePrice, { color: colors.text }]}>350 ₺</Text>
                            <Text style={{ color: colors.text, marginBottom: 4, fontSize: 12 }}>{selectedTime} - {times[times.indexOf(selectedTime) + 1]}</Text>
                        </View>
                    </View>
                    <View style={[styles.serviceLine, { backgroundColor: colors.softBorder }]} />
                    <View style={styles.employeeLine}>
                        <Text style={{ color: colors.text }}>Çalışan: {selectedEmployee === 'julide' ? 'Jülide Aslan' : 'İrem Taş'}</Text>
                        <TouchableOpacity style={styles.editButton}>
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

                {/* Alt Toplam ve Buton */}
                <View style={styles.footer}>
                    <View>
                        <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>350 ₺</Text>
                        <Text style={{ color: colors.mutedText }}>30 dk</Text>
                    </View>
                    <TouchableOpacity style={[styles.confirmButton, { backgroundColor: colors.primary }]}>
                        <Text style={{ color: colors.buttonText, fontWeight: 'bold' }}>Randevuyu Düzenle</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 64,
        paddingHorizontal: 16,
    },
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