import { useTheme } from '@/src/context/ThemeContext';
import { themes } from '@/src/theme/theme';

export const useAppTheme = () => {
    const { theme, setTheme } = useTheme();
    const colors = themes[theme];
    return {
        theme,
        setTheme,
        colors,
        isDark: theme === 'dark',
    };
};