import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
export default function SalonDetailsTab() {
    const { colors, isDark } = useAppTheme();
    const openMap = () => {
        const latitude = 41.072; // Örnek koordinat
        const longitude = 29.007;

        const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${latitude},${longitude}`,
            android: `geo:${latitude},${longitude}?q=Rose+Life+Nişantaşı`,
        });

        Linking.openURL(url as string).catch(err => console.error('Harita açılamadı:', err));
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Harita ve Bilgi Kutusu */}
            <View style={[styles.mapBox, { backgroundColor: colors.card }]}>
                <Image source={require('../../assets/map-snapshot.png')} style={styles.mapImage} />
                <View style={styles.mapInfo}>
                    <Image source={require('../../assets/images/salons/defaultimage.png')} style={styles.avatar} />
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.salonName, { color: colors.text }]}>Rose Life Nişantaşı</Text>
                        <Text style={[styles.salonAddress, { color: colors.text }]}>34920 Vadi İstanbul Avrupa Yakası...</Text>
                    </View>
                    <TouchableOpacity onPress={openMap}>
                        <Ionicons name="location-outline" size={20} color={colors.icon} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>About Us</Text>
                <Text style={[styles.paragraph, { color: colors.text }]}>Our specialists are here to enhance your beauty, especially in microblading and many more.</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Staff</Text>
                <View style={styles.staffRow}>
                    <View style={styles.staffItem}>
                        <Ionicons name="person-circle-outline" size={40} color={colors.icon} />
                        <Text style={[styles.staffName, { color: colors.text }]}>Jülide Aslan</Text>
                    </View>
                    <View style={styles.staffItem}>
                        <Ionicons name="person-circle-outline" size={40} color={colors.icon} />
                        <Text style={[styles.staffName, { color: colors.text }]}>İrem Taş</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact & Working Hours</Text>
                <View style={styles.scheduleRow}><Text style={[styles.day, { color: colors.text }]}>Monday</Text><Text style={[styles.time, { color: colors.text }]}>09:00 - 19:00</Text></View>
                <View style={styles.scheduleRow}><Text style={[styles.day, { color: colors.text }]}>Tuesday</Text><Text style={[styles.time, { color: colors.text }]}>09:00 - 19:00</Text></View>
                <View style={styles.scheduleRow}><Text style={[styles.day, { color: colors.text }]}>Wednesday</Text><Text style={[styles.time, { color: colors.text }]}>09:00 - 19:00</Text></View>
                <View style={styles.scheduleRow}><Text style={[styles.day, { color: colors.text }]}>Thursday</Text><Text style={[styles.time, { color: colors.text }]}>09:00 - 19:00</Text></View>
                <View style={styles.scheduleRow}><Text style={[styles.day, { color: colors.text }]}>Friday</Text><Text style={[styles.time, { color: colors.text }]}>09:00 - 19:00</Text></View>
                <View style={styles.scheduleRow}><Text style={[styles.day, { color: colors.text }]}>Saturday</Text><Text style={[styles.time, { color: colors.text }]}>Closed</Text></View>
                <View style={styles.scheduleRow}><Text style={[styles.day, { color: colors.text }]}>Sunday</Text><Text style={[styles.time, { color: colors.text }]}>Closed</Text></View>

                <View style={styles.phoneRow}>
                    <Text style={[styles.phoneNumber, { color: colors.text }]}>0 (216) 444 444</Text>
                    <TouchableOpacity
                        style={[styles.callButton, { backgroundColor: isDark ? '#fff' : '#000' }]}
                    >
                        <Feather name="phone-call" size={18} color={isDark ? '#000' : '#fff'} />
                        <Text style={{ color: isDark ? '#000' : '#fff', fontSize: 13 }}>Call</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Social Media</Text>
                <View style={styles.socialRow}>
                <View style={styles.socialItem}>
                <FontAwesome name="whatsapp" size={24} color={colors.icon} />
                        <Text style={[styles.socialLabel, { color: colors.text }]}>Whatsapp</Text>
                    </View>
                    <View style={styles.socialItem}>
                        <Feather name="instagram" size={24} color={colors.icon} />
                        <Text style={[styles.socialLabel, { color: colors.text }]}>Instagram</Text>
                    </View>
                    <View style={styles.socialItem}>
                        <Feather name="facebook" size={24} color={colors.icon} />
                        <Text style={[styles.socialLabel, { color: colors.text }]}>Facebook</Text>
                    </View>
                </View>
            </View>

            <View style={styles.reportContainer}>
                <Text style={[styles.reportPrompt, { color: colors.text }]}>Have a complaint?</Text>
                <TouchableOpacity style={[styles.reportButton, { borderColor: colors.text, backgroundColor: colors.background }]}>
                    <Text style={[styles.reportButtonText, { color: colors.text }]}>Report</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    mapContainer: {
        marginBottom: 16,
        borderRadius: 8,
    },
    mapBox: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    mapImage: {
        width: '100%',
        height: 160,
    },

    mapInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.04)', // tema uyumlu
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },

    salonName: {
        fontWeight: 'bold',
        fontSize: 14,
    },

    salonAddress: {
        fontSize: 12,
        opacity: 0.8,
    },
    mapLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        marginTop: -30,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    mapLabelTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    mapLabelAddress: {
        fontSize: 12,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    paragraph: {
        fontSize: 14,
    },
    staffRow: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 8,
    },
    staffItem: {
        alignItems: 'center',
    },
    staffName: {
        fontSize: 13,
        marginTop: 4,
    },
    scheduleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    day: {
        fontSize: 14,
    },
    time: {
        fontSize: 14,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
    },
    phoneNumber: {
        fontSize: 15,
        flex: 1,
    },
    callButton: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    socialRow: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 10,
    },
    socialItem: {
        alignItems: 'center',
    },
    socialLabel: {
        fontSize: 13,
        marginTop: 4,
    },
    reportContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reportPrompt: {
        fontSize: 13,
    },
    reportButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    reportButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
});