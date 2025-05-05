import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { mockAppointments } from '@/src/data/appointments';
import { Calendar } from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { LocaleConfig } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { setupCalendarLocales } from '@/src/config/calendarLocales';
import { formatDate } from '@/src/config/date';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { format } from 'date-fns'; // en üstte
type Appointment = {
    id: string;
    date: string;
    salon: string;
    service: string;
    employee: string;
    price: number;
    start: string;
    end: string;
    status: 'active' | 'cancelled';
};

export default function AppointmentsScreen() {
    const { colors, isDark } = useAppTheme();
    const { t, i18n } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const router = useRouter();

    const appointments = mockAppointments.filter(a => a.date === selectedDate);

    const [calendarReady, setCalendarReady] = useState(false);
    const [selectedToCancel, setSelectedToCancel] = useState<Appointment | null>(null);
    const [cancelStep, setCancelStep] = useState<'confirm' | 'loading' | 'success' | null>(null);


    useEffect(() => {
        if (cancelStep === 'success') {
            const timeout = setTimeout(() => {
                setCancelStep(null);
                setSelectedToCancel(null);
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [cancelStep]);

    useEffect(() => {
        setupCalendarLocales();
        LocaleConfig.defaultLocale = i18n.language;
        setCalendarReady(false);
        setTimeout(() => setCalendarReady(true), 50); // kısa bir bekleme ile yeniden render
    }, [i18n.language]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} translucent={false} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: colors.text,
                        textAlign: 'center',
                        marginTop: 16,
                        marginHorizontal: 16,
                        marginBottom: 8,
                    }}
                >
                    {t('appointments.title')}
                </Text>

                <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>

                    {calendarReady && (
                        <Calendar
                            current={selectedDate} // bugünün tarihi burada
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
                    )}

                    <Text
                        style={[
                            styles.dateText,
                            { color: colors.text }
                        ]}
                    >
                        {formatDate(selectedDate, i18n.language)}
                    </Text>

                    {appointments.length === 0 && (
                        <View style={[styles.noAppointmentBox, { backgroundColor: colors.card, borderColor: colors.softBorder }]}>
                            <Feather name="calendar" size={20} color={colors.icon} style={{ marginBottom: 6 }} />
                            <Text style={{ color: colors.text, fontSize: 14, textAlign: 'center' }}>
                                {t('appointments.noAppointments')}
                            </Text>
                        </View>
                    )}

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
                                        <Text style={[styles.infoText, { color: colors.icon }]}>{t('appointments.employee')}: {a.employee}</Text>
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
                                        <Feather name="edit" size={14} color="#1585A6" /> {t('appointments.edit')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => {
                                    setSelectedToCancel(a);       // hangi randevuyu iptal edeceğini ayarla
                                    setCancelStep('confirm');     // 1. modalı aç
                                }}
                                >
                                    <Text style={styles.cancelButtonText}>
                                        <Feather name="x-circle" size={14} color="#d9534f" /> {t('appointments.cancel')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <Modal transparent visible={cancelStep !== null} animationType="fade">
                        <View style={styles.modalOverlay}>
                            <View style={[
                                styles.modalBox,
                                cancelStep === 'success' ? styles.successBox :
                                    cancelStep === 'loading' ? styles.loadingBox :
                                        styles.confirmBox
                            ]}>
                                {/* Başlık */}
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>
                                        {cancelStep === 'success' && 'Onay ✅'}
                                        {cancelStep === 'loading' && 'İptal 🔄'}
                                        {cancelStep === 'confirm' && 'İptal ❌'}
                                    </Text>
                                </View>

                                {/* İçerik */}
                                {cancelStep === 'confirm' && (
                                    <>
                                        <Text style={styles.modalText}>İptal etmek istediğinize emin misiniz?</Text>
                                        <View style={styles.modalButtonRow}>
                                            <TouchableOpacity
                                                style={styles.modalButton}
                                                onPress={() => {
                                                    setCancelStep('loading');
                                                    setTimeout(() => {
                                                        // iptal işlemi
                                                        // burada selectedToCancel.status = 'cancelled' gibi güncelleme yapabilirsin
                                                        // örnek için basit bir state update yazılabilir
                                                        setCancelStep('success');
                                                    }, 1500);
                                                }}
                                            >
                                                <Text style={styles.modalButtonText}>Evet</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                                                onPress={() => setCancelStep(null)}
                                            >
                                                <Text style={styles.modalButtonText}>Hayır</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}

                                {cancelStep === 'loading' && (
                                    <>
                                        <Text style={styles.modalText}>Randevu iptal ediliyor..</Text>
                                        <ActivityIndicator size="large" color="#e11d48" style={{ marginTop: 16 }} />
                                    </>
                                )}
                                {cancelStep === 'success' && (
                                    <>
                                        <Text style={styles.modalText}>
                                            Randevu başarılı bir şekilde iptal edilmiştir.
                                        </Text>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>
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
    noAppointmentBox: {
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBox: {
        width: '80%',
        borderRadius: 12,
        padding: 20,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    confirmBox: {
        borderColor: '#e11d48',
        borderWidth: 2,
    },
    loadingBox: {
        borderColor: '#facc15',
        borderWidth: 2,
    },
    successBox: {
        borderColor: '#22c55e',
        borderWidth: 2,
    },
    modalHeader: {
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalText: {
        fontSize: 15,
        textAlign: 'center',
    },
    modalButtonRow: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 10,
    },
    modalButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#e11d48',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
