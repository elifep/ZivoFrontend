// src/config/i18n.ts
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from '../locales/tr.json';
import en from '../locales/en.json';
import ar from '../locales/ar.json';


i18n
  .use(initReactI18next)
  .init({
    lng: Localization.getLocales()?.[0]?.languageCode?.startsWith('tr')
      ? 'tr'
      : Localization.getLocales()?.[0]?.languageCode?.startsWith('ar')
        ? 'ar'
        : 'en',
    fallbackLng: 'tr',
    resources: {
      tr: { translation: tr },
      en: { translation: en },
      ar: { translation: ar }
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;