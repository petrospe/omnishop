import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import StorefrontLayout from '@/Components/StorefrontLayout';

const pages = ['notice', 'terms', 'privacy', 'cookies', 'withdrawal', 'shipping'];

export default function Legal({ page }) {
    const { t } = useTranslation();
    const { shop } = usePage().props;
    const company = shop?.company ?? {};
    const key = pages.includes(page) ? page : 'notice';
    const blocks = t(`legal.pages.${key}.blocks`, {
        returnObjects: true,
        company: company.name || t('legal.unnamed'),
        currency: shop?.currency || 'USD',
    });
    const address = [company.address, company.postalCode, company.city, company.country]
        .filter(Boolean)
        .join(', ');

    return (
        <StorefrontLayout>
            <Head title={t(`legal.pages.${key}.title`)} />
            <article className="mx-auto max-w-3xl px-6 py-14">
                <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">
                    {t('footer.legal')}
                </p>
                <h1 className="mt-3 text-3xl font-light uppercase tracking-[0.08em]">
                    {t(`legal.pages.${key}.title`)}
                </h1>
                {key === 'notice' && (
                    <dl className="mt-8 grid gap-4 border border-black/10 bg-[#f7f6f4] p-6 text-sm">
                        {company.name && (
                            <div>
                                <dt className="text-[10px] uppercase tracking-[0.12em] text-black/45">
                                    {t('legal.identity')}
                                </dt>
                                <dd className="mt-1">{company.name}</dd>
                            </div>
                        )}
                        {address && (
                            <div>
                                <dt className="text-[10px] uppercase tracking-[0.12em] text-black/45">
                                    {t('legal.address')}
                                </dt>
                                <dd className="mt-1">{address}</dd>
                            </div>
                        )}
                        {(company.phones ?? []).map((phone) => (
                            <div key={phone}>
                                <dt className="text-[10px] uppercase tracking-[0.12em] text-black/45">
                                    {t('footer.phone')}
                                </dt>
                                <dd className="mt-1">
                                    <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                                </dd>
                            </div>
                        ))}
                        {company.email && (
                            <div>
                                <dt className="text-[10px] uppercase tracking-[0.12em] text-black/45">
                                    {t('footer.email')}
                                </dt>
                                <dd className="mt-1">
                                    <a href={`mailto:${company.email}`}>{company.email}</a>
                                </dd>
                            </div>
                        )}
                        {company.vat && (
                            <div>
                                <dt className="text-[10px] uppercase tracking-[0.12em] text-black/45">
                                    {t('footer.vat')}
                                </dt>
                                <dd className="mt-1">{company.vat}</dd>
                            </div>
                        )}
                        {company.registry && (
                            <div>
                                <dt className="text-[10px] uppercase tracking-[0.12em] text-black/45">
                                    {t('footer.registry')}
                                </dt>
                                <dd className="mt-1">{company.registry}</dd>
                            </div>
                        )}
                    </dl>
                )}
                <div className="mt-10 flex flex-col gap-8">
                    {Array.isArray(blocks) &&
                        blocks.map((block) => (
                            <section key={block.heading}>
                                <h2 className="text-sm uppercase tracking-[0.12em]">
                                    {block.heading}
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-black/70">
                                    {block.text}
                                </p>
                            </section>
                        ))}
                </div>
            </article>
        </StorefrontLayout>
    );
}
