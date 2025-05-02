import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { mockAppointments } from '@/src/data/appointments';
import { Calendar } from 'react-native-calendars';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { LocaleConfig } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { setupCalendarLocales } from '@/src/config/calendarLocales';
import { formatDate } from '@/src/config/date';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AppointmentsScreen() {
    const { colors, isDark } = useAppTheme();
    const { i18n } = useTranslation();
    const [selectedDate, setSelectedDate] = useState('2025-04-10');
    const router = useRouter();

    const appointments = mockAppointments.filter(a => a.date === selectedDate);

    useEffect(() => {
        setupCalendarLocales();
        LocaleConfig.defaultLocale = i18n.language.startsWith('tr') ? 'tr' : 'en';
    }, [i18n.language]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} translucent={false} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                    <Calendar
                        key={i18n.language}
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        markedDates={{
                            [selectedDate]: { selected: true, selectedColor: colors.primary },
                        }}
                        theme={{
                            calendarBackground: colors.background,
                            dayTextColor: colors.text,
                            monthTextColor: colors.text,
                            todayTextColor: colors.primary,
                            selectedDayBackgroundColor: colors.primary,
                            selectedDayTextColor: colors.background,
                            arrowColor: colors.text,
                        }}
                    />

                    <Text style={[styles.dateText, { color: colors.text }]}>
                        {formatDate(selectedDate, i18n.language.startsWith('tr') ? 'tr' : 'en')}
                    </Text>

                    {appointments.map((a) => (
                        <View key={a.id} style={[styles.card, { backgroundColor: colors.card }]}>
                            <View style={styles.cardTopRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Feather name="map-pin" size={16} color={colors.text} />
                                    <Text style={[styles.salonText, { color: colors.text }]}>{a.salon}</Text>
                                </View>
                            </View>
                            <View style={[styles.serviceLine, { backgroundColor: colors.softBorder }]} />
                            <View style={styles.rowBetween}>
                                <View >
                                    <View style={styles.infoRow}>
                                        <Feather name="scissors" size={14} color={colors.icon} />
                                        <Text style={[styles.infoText, { color: colors.icon }]}>{a.service}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Feather name="user" size={14} color={colors.icon} />
                                        <Text style={[styles.infoText, { color: colors.icon }]}>Çalışan: {a.employee}</Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.priceText, { color: colors.text }]}>{a.price} ₺</Text>
                                    <Text style={[styles.timeText, { color: colors.icon }]}>{a.start} - {a.end}</Text>
                                </View>
                            </View>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => router.push({ pathname: '/EditAppointmentScreen', params: { appointment: JSON.stringify(a) } })}>
                                    <Text style={styles.editButtonText}>
                                        <Feather name="edit" size={14} color="#1585A6" /> Düzenle
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
                                    <Text style={styles.cancelButtonText}>
                                        <Feather name="x-circle" size={14} color="#d9534f" /> İptal Et
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    dateText: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 14,
        textAlign: 'center',
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 14,
        borderRadius: 12,
        elevation: 2,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    salonText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    priceText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    timeText: {
        fontSize: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginVertical: 2,
    },
    infoText: {
        fontSize: 13,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        borderWidth: 1,
    },
    editButton: {
        borderColor: '#218CAC',
    },
    cancelButton: {
        borderColor: '#d9534f',
    },
    editButtonText: {
        color: '#1585A6',
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#d9534f',
        fontWeight: '600',
    },
    serviceLine: {
        height: 1,
        marginVertical: 8,
    },
});
