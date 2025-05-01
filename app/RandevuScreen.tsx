import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function RandevuScreen() {
    const router = useRouter();
    const { colors, isDark } = useAppTheme();

    const [selectedEmployee, setSelectedEmployee] = useState<string | null>('irem');
    const [selectedDate, setSelectedDate] = useState<string>('2025-06-10');
    const [selectedTime, setSelectedTime] = useState<string>('11:30');
    const [note, setNote] = useState('');

    const timeSlots = ['11:00', '11:30', '11:45', '12:00'];

    return (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100, backgroundColor: colors.background }}>

            {/* Geri Butonu */}
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8 }}>Randevu Al</Text>
            </TouchableOpacity>

            {/* Çalışan Seçimi */}
            <View style={styles.employeeRow}>
                <TouchableOpacity style={styles.farkEtmezButton}><Text>Fark Etmez</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedEmployee('irem')}>
                    <Ionicons name="person-circle" size={50} color={selectedEmployee === 'irem' ? 'purple' : colors.icon} />
                    <Text style={styles.employeeLabel}>İrem Taş</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedEmployee('julide')}>
                    <Ionicons name="person-circle" size={50} color={selectedEmployee === 'julide' ? 'purple' : colors.icon} />
                    <Text style={styles.employeeLabel}>Jülide Aslan</Text>
                </TouchableOpacity>
            </View>

            {/* Takvim */}
            <Calendar
                current={selectedDate}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                theme={{
                    backgroundColor: colors.background,
                    calendarBackground: colors.background,
                    textSectionTitleColor: colors.text,
                    dayTextColor: colors.text,
                    selectedDayBackgroundColor: colors.primary,
                    selectedDayTextColor: '#fff',
                    todayTextColor: '#000',
                    arrowColor: colors.text,
                    monthTextColor: colors.text,
                }}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: colors.primary },
                }}
                style={{ marginVertical: 16 }}
            />

            {/* Saat Seçimi */}
            <FlatList
                horizontal
                data={timeSlots}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedTime(item)}
                        style={[
                            styles.timeSlot,
                            {
                                backgroundColor: selectedTime === item ? colors.text : colors.background,
                                borderColor: colors.text,
                            },
                        ]}
                    >
                        <Text style={{ color: selectedTime === item ? colors.background : colors.text }}>{item}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                contentContainerStyle={{ gap: 8, marginBottom: 16 }}
                showsHorizontalScrollIndicator={false}
            />

            {/* Seçilen Hizmet */}
            <View style={[styles.serviceCard, { backgroundColor: colors.card }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.serviceTitle, { color: colors.text }]}>Manikür</Text>
                    <Text style={[styles.servicePrice, { color: colors.text }]}>350 ₺</Text>
                </View>
                <Text style={{ color: colors.text, marginBottom: 4 }}>{selectedTime} - 11:30</Text>
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

            {/* Not */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                <Ionicons name="chatbubble-outline" size={16} color={colors.text} />
                <Text style={{ color: colors.text, marginLeft: 6 }}>Not Bırak (opsiyonel)</Text>
            </View>
            <TextInput
                placeholder="Notunuz..."
                placeholderTextColor="#888"
                value={note}
                onChangeText={setNote}
                style={{
                    backgroundColor: colors.searchBackground,
                    color: colors.text,
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 16,
                }}
            />

            {/* Alt Toplam ve Buton */}
            <View style={styles.footer}>
                <View>
                    <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>350 ₺</Text>
                    <Text style={{ color: '#999' }}>30 dk</Text>
                </View>
                <TouchableOpacity style={styles.confirmButton}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Randevuyu Onayla</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
        borderColor: '#ccc',
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
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    confirmButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
});