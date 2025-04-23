import { Slot } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import './config/i18n'; // sadece 1 kez çağır

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}