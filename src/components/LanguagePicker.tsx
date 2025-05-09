import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAppTheme } from '@/hooks/useAppTheme';
import { View, StyleSheet } from 'react-native';

export default function LanguagePicker() {
    const { colors } = useAppTheme();
    const { i18n } = useTranslation();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(i18n.language);
    const [items, setItems] = useState([
        { label: 'Türkçe 🇹🇷', value: 'tr' },
        { label: 'English 🇺🇸', value: 'en' },
        { label: 'العربية 🇸🇦', value: 'ar' },
    ]);

    return (
        <View style={{ zIndex: 2000 }}>
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
                listMode="SCROLLVIEW"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    marginBottom: open ? 180 : 16, // açıkken alttaki öğeler çakışmasın
                }}
                textStyle={{
                    color: colors.text,
                    fontSize: 14,
                }}
                dropDownContainerStyle={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    maxHeight: 150, // 👈 max yüksekliği kısıtla
                }}
            />
        </View>
    );
}