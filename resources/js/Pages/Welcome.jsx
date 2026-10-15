import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/Components/ProductCard';
import StorefrontLayout from '@/Components/StorefrontLayout';
import useStorefront from '@/hooks/useStorefront';
import { categoryLabel } from '@/i18n';

export default function Welcome() {
    const { t } = useTranslation();
    const { catalog, shop } = usePage().props;
    const categories = catalog?.categories ?? [];
    const products = (catalog?.products ?? []).slice(0, 4);
    const heroLines = (shop?.heroTitle ?? '').split('\n');
    const collectionHref = shop?.heroCategorySlug
        ? route('shop.category', shop.heroCategorySlug)
        : '/';
    const { wishlist, toggleWishlist } = useStorefront();

    return (
        <StorefrontLayout>
            <Head title={t('home.title')} />
            <section className="relative min-h-[68vh] bg-[#e8e5e0] sm:min-h-[78vh]">
                <img
                    src={shop.heroImage}
                    alt={shop.heroImageAlt}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/15" />
                <div className="relative flex min-h-[68vh] flex-col items-center justify-end gap-5 px-6 pb-12 text-center text-white sm:min-h-[78vh] sm:pb-16">
                    <p className="text-[10px] uppercase tracking-[0.25em] sm:text-xs">
                        {shop.heroEyebrow}
                    </p>
                    <h1 className="max-w-3xl text-4xl font-light uppercase leading-[0.95] tracking-[0.08em] sm:text-6xl md:text-7xl">
                        {heroLines.map((line, index) => (
                            <span key={index} className="block">
                                {line}
                            </span>
                        ))}
                    </h1>
                    <Link
                        href={collectionHref}
                        className="mt-2 border border-white px-8 py-3 text-[10px] uppercase tracking-[0.16em] transition hover:bg-white hover:text-black"
                    >
                        {shop.heroButtonLabel}
                    </Link>
                </div>
            </section>

            <section className="mx-auto max-w-[1600px] px-4 py-14 sm:px-8 sm:py-20">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-black/50">
                            {shop.collectionsEyebrow}
                        </p>
                        <h2 className="mt-2 text-2xl font-light uppercase tracking-[0.08em] sm:text-3xl">
                            {shop.collectionsTitle}
                        </h2>
                    </div>
                    <Link
                        href={collectionHref}
                        className="hidden border-b border-black pb-1 text-[10px] uppercase tracking-[0.12em] sm:inline"
                    >
                        {t('home.viewAll')}
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
                    {categories.map((collection) => (
                        <Link
                            key={collection.slug}
                            href={route('shop.category', collection.slug)}
                            className="group relative aspect-[4/5] overflow-hidden bg-[#f0efed]"
                        >
                            <img
                                src={collection.image}
                                alt={collection.imageAlt}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />
                            <span className="absolute bottom-6 left-6 text-lg uppercase tracking-[0.16em] text-white">
                                {categoryLabel(t, collection.slug, collection.name)}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1600px] px-4 pb-4 sm:px-8 sm:pb-12">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-black/50">
                            {shop.latestEyebrow}
                        </p>
                        <h2 className="mt-2 text-2xl font-light uppercase tracking-[0.08em] sm:text-3xl">
                            {shop.latestTitle}
                        </h2>
                    </div>
                    <Link
                        href={collectionHref}
                        className="border-b border-black pb-1 text-[10px] uppercase tracking-[0.12em]"
                    >
                        {t('home.shopCollection')}
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.slug}
                            product={product}
                            saved={wishlist.includes(product.slug)}
                            onToggleWishlist={toggleWishlist}
                        />
                    ))}
                </div>
            </section>

            <section className="mx-4 mt-16 grid bg-[#f4f3f1] px-6 py-12 text-center sm:mx-8 sm:py-16">
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                    {shop.closingEyebrow}
                </p>
                <p className="mx-auto mt-4 max-w-xl text-xl font-light leading-relaxed sm:text-2xl">
                    {shop.closingText}
                </p>
            </section>
        </StorefrontLayout>
    );
}
