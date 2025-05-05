import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { StyleSheet } from 'react-native';

export default function LanguagePicker() {
    const { colors } = useAppTheme();
    const { i18n } = useTranslation();

    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState(i18n.language);
    const [items, setItems] = useState([
        { label: 'Türkçe 🇹🇷', value: 'tr' },
        { label: 'English 🇺🇸', value: 'en' },
        { label: 'العربية 🇸🇦', value: 'ar' },
    ]);

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
                const newLang = callback(value);
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
            dropDownContainerStyle={[styles.dropDownContainer, {
                backgroundColor: colors.card,
                borderColor: colors.border,
            }]}
            listMode="SCROLLVIEW"
            zIndex={4000} 
        />
    );
}
const styles = StyleSheet.create({
    dropDownContainer: {
        alignItems: 'baseline',
    }
});