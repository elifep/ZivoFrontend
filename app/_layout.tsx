import { Slot } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}