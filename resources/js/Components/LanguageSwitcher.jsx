import { useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { applyLocale } from '@/i18n';

export default function LanguageSwitcher({ className = '' }) {
    const { locale, locales } = usePage().props;
    const { t } = useTranslation();
    const current = locale || 'en';

    useEffect(() => {
        applyLocale(current);
    }, [current]);
    const choices = Array.isArray(locales) && locales.length > 0 ? locales : ['en', 'el'];

    const choose = (code) => {
        if (code === current) {
            return;
        }

        router.post(
            route('locale.update'),
            { locale: code },
            { preserveScroll: true },
        );
    };

    return (
        <div
            className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] ${className}`}
            role="group"
            aria-label={t('nav.language')}
        >
            {choices.map((code) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => choose(code)}
                    aria-pressed={current === code}
                    className={
                        current === code
                            ? 'text-black'
                            : 'text-black/40 transition hover:text-black'
                    }
                >
                    {code}
                </button>
            ))}
        </div>
    );
}
