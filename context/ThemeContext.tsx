import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
    theme: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemTheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
    const [theme, setThemeState] = useState<ThemeMode>(systemTheme);

    useEffect(() => {
        const loadStoredTheme = async () => {
            const stored = await AsyncStorage.getItem('user-theme');
            if (stored === 'light' || stored === 'dark') {
                setThemeState(stored);
            }
        };
        loadStoredTheme();
    }, []);

    const setTheme = (mode: ThemeMode) => {
        setThemeState(mode);
        AsyncStorage.setItem('user-theme', mode);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};