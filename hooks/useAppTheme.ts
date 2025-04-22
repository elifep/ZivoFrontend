import { useTheme } from '@/context/ThemeContext';
import { themes } from '@/theme/theme';

export const useAppTheme = () => {
    const { theme, setTheme } = useTheme();
    const colors = themes[theme];
    return { theme, setTheme, colors };
};