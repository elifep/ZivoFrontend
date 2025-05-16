import { useEffect, useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';

export default function ThemePicker() {
    const { theme, setTheme, colors } = useAppTheme();
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState(theme);
    const [items, setItems] = useState([
        { label: t('profile.light') , value: 'light' },
        { label: t('profile.dark'), value: 'dark' },
    ]);
    useEffect(() => {
      setItems([
        { label: t('profile.light') , value: 'light' },
        { label: t('profile.dark'), value: 'dark' },
      ])
    }, [t])

    return (
        <View style={{ zIndex: open ? 10 : 1, position: 'relative' }}>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={(callback) => {
                    const newTheme = callback(value) as 'light' | 'dark';
                    setValue(newTheme);
                    setTheme(newTheme);
                }}
                setItems={setItems}
                placeholder="Tema Seçin"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    marginBottom: 16,
                }}
                textStyle={{
                    color: colors.text,
                }}
                dropDownContainerStyle={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
                listMode="SCROLLVIEW" // ❗ hata çözümü
                zIndex={5000} // açılınca diğerlerinin üstünde
            />
        </View>
    );
}