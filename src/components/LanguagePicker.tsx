import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export default function LanguagePicker() {
    const { colors } = useAppTheme();
    const { i18n } = useTranslation();

    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState(i18n.language.startsWith('tr') ? 'tr' : 'en');
    const [items, setItems] = useState([
        { label: 'Türkçe 🇹🇷', value: 'tr' },
        { label: 'English 🇺🇸', value: 'en' },
    ]);

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
                const newLang = callback(value) as 'tr' | 'en';
                setValue(newLang);
                i18n.changeLanguage(newLang);
            }}
            setItems={setItems}
            placeholder="Dil Seçin"
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
            zIndex={4000} // diğer dropdownlarla uyumlu
        />
    );
}