import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export default function ThemePicker() {
    const { theme, setTheme, colors } = useAppTheme();

    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState(theme);
    const [items, setItems] = useState([
        { label: 'Açık Tema', value: 'light' },
        { label: 'Koyu Tema', value: 'dark' },
    ]);

    return (
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
    );
}