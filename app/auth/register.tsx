import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>HOŞ GELDİNİZ</Text>
            <Text style={styles.subtitle}>Kayıt Ol</Text>

            <TextInput style={styles.input} placeholder="E-mail girin." />
            <TextInput style={styles.input} placeholder="Şifre girin." secureTextEntry />
            <TextInput style={styles.input} placeholder="Şifreyi Doğrula" secureTextEntry />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.link}>Zaten hesabın var mı? Giriş Yap.</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24, flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    subtitle: { fontSize: 18, textAlign: 'center', marginVertical: 16 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginVertical: 8 },
    button: { backgroundColor: '#111', padding: 12, borderRadius: 8, marginTop: 12 },
    buttonText: { color: '#fff', textAlign: 'center' },
    link: { color: 'blue', marginTop: 16, textAlign: 'center' },
});