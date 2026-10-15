import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import StorefrontLayout from '@/Components/StorefrontLayout';

export default function Success({ orderNumber, paid, clearCart }) {
    const { t } = useTranslation();
    useEffect(() => {
        if (! clearCart) {
            return;
        }

        window.localStorage.setItem('omnishop-cart', '{}');
        window.dispatchEvent(
            new CustomEvent('omnishop:storage', {
                detail: { key: 'omnishop-cart', value: {} },
            }),
        );
    }, [clearCart]);

    return (
        <StorefrontLayout>
            <Head title={paid ? t('checkout.confirmed') : t('checkout.pending')} />
            <div className="mx-auto max-w-xl px-6 py-24 text-center">
                <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-black/50">
                    {paid ? t('checkout.thanks') : t('checkout.almost')}
                </p>
                <h1 className="text-3xl font-light uppercase tracking-[0.1em]">
                    {paid ? t('checkout.confirmed') : t('checkout.pending')}
                </h1>
                <p className="mt-6 text-sm leading-6 text-black/65">
                    {paid
                        ? t('checkout.paid', { order: orderNumber })
                        : t('checkout.waiting', { order: orderNumber })}
                </p>
                <Link
                    href="/"
                    className="mt-10 inline-block bg-black px-8 py-4 text-[10px] uppercase tracking-[0.15em] text-white"
                >
                    {t('checkout.back')}
                </Link>
            </div>
        </StorefrontLayout>
    );
}
