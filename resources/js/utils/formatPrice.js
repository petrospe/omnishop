import { usePage } from '@inertiajs/react';

export function formatPrice(price, currency = 'USD', locale = 'en') {
    const code = String(currency || 'USD').toUpperCase();

    return new Intl.NumberFormat(locale === 'el' ? 'el-GR' : 'en-US', {
        style: 'currency',
        currency: code,
    }).format(price);
}

export function useFormatPrice() {
    const { shop, locale } = usePage().props;

    return (price) => formatPrice(price, shop?.currency || 'USD', locale || 'en');
}
