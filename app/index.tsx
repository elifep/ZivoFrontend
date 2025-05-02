import { Redirect } from 'expo-router';

// Daha sonra buraya auth durumu ekleyebilirsin (örneğin AsyncStorage kontrolü)
export default function Index() {
    console.log('Index');
    return <Redirect href="/auth/login" />;
}