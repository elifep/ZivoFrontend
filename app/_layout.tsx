import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { usePathname } from 'expo-router';
import '@/config/i18n';
import Toast from 'react-native-toast-message';

function StatusBarWithTheme() {
  const { theme } = useTheme();
  const pathname = usePathname();

  const isIndex = pathname === '/';

  return (
    <StatusBar
      style={(isIndex || theme === 'dark') ? 'light' : 'dark'}
      backgroundColor={isIndex ? '#000' : 'transparent'}
      translucent={!isIndex}
    />
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBarWithTheme />
      <Stack>
        <Stack.Screen name='auth' options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="SalonDetailScreen" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="RandevuScreen" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="EditAppointmentScreen" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name='MapScreen' options={{ headerShown: false, presentation: 'card' }} />
      </Stack>
      <Toast />
    </ThemeProvider>
  );
}