import { Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import './config/i18n';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="SalonDetailScreen" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="salon-services" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="salon-reviews" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="salon-portfolio" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="salon-details" options={{ headerShown: false, presentation: 'card' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}