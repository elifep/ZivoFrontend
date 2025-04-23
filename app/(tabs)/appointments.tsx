import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { mockAppointments } from '@/data/appointments';
import { Calendar } from 'react-native-calendars';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { LocaleConfig } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { setupCalendarLocales } from '../config/calendarLocales';
import { formatDate } from '../config/date';

export default function AppointmentsScreen() {
    const { colors } = useAppTheme();
    const { t, i18n } = useTranslation();
    const [selectedDate, setSelectedDate] = useState('2025-04-10');

    const appointments = mockAppointments.filter((a) => a.date === selectedDate);

    useEffect(() => {
        setupCalendarLocales();
        LocaleConfig.defaultLocale = i18n.language.startsWith('tr') ? 'tr' : 'en';
    }, [i18n.language]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <Calendar
                    key={i18n.language} // ✅ Yeniden render'ı zorlar
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
                    locale={i18n.language} // 🌍 otomatik dil seçimi gerek kalmadı
                />


                <Text style={[styles.dateText, { color: colors.text }]}>
                    {formatDate(selectedDate, i18n.language.startsWith('tr') ? 'tr' : 'en')}
                </Text>

                {appointments.map((a) => (
                    <View key={a.id} style={[styles.card, { backgroundColor: colors.card }]}>
                        <View style={styles.rowBetween}>
                            <View style={styles.rowAlign}>
                                <FontAwesome name="building-o" size={16} color={colors.text} />
                                <Text style={[styles.salon, { color: colors.text }]}>{a.salon}</Text>
                            </View>
                            <Text style={[styles.price, { color: colors.text }]}>{a.price} ₺</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Feather name="scissors" size={14} color={colors.icon} />
                            <Text style={[styles.infoText, { color: colors.icon }]}>{a.service}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Feather name="user" size={14} color={colors.icon} />
                            <Text style={[styles.infoText, { color: colors.icon }]}>
                                {t('appointments.employee')}: {a.employee}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Feather name="clock" size={14} color={colors.icon} />
                            <Text style={[styles.infoText, { color: colors.icon }]}>
                                {a.start} - {a.end}
                            </Text>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.button, styles.editBtn]}>
                                <Text style={[styles.editText]}>
                                    {t('buttons.edit')} <Feather name="edit-3" size={14} />
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancelBtn]}>
                                <Text style={[styles.cancelText]}>
                                    {t('buttons.cancel')} <Feather name="x-circle" size={14} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    dateText: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 12,
        textAlign: 'center',
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    rowAlign: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
    },
    salon: {
        fontSize: 16,
        fontWeight: '600',
    },
    price: {
        fontSize: 15,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4,
    },
    editBtn: {
        borderWidth: 1,
        borderColor: '#00bfff',
    },
    cancelBtn: {
        borderWidth: 1,
        borderColor: '#a94442',
    },
    editText: {
        color: '#00bfff',
        fontWeight: '600',
    },
    cancelText: {
        color: '#a94442',
        fontWeight: '600',
    },
});