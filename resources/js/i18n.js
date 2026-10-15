import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import el from './locales/el.json';
import en from './locales/en.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        el: { translation: el },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export function applyLocale(locale) {
    if (typeof locale === 'string' && locale !== '' && i18n.resolvedLanguage !== locale) {
        i18n.changeLanguage(locale);
    }

    if (typeof document !== 'undefined' && typeof locale === 'string' && locale !== '') {
        document.documentElement.lang = locale;
    }
}

export function categoryLabel(t, slug, fallback) {
    return t(`categories.${slug}`, { defaultValue: fallback || slug });
}

export default i18n;
