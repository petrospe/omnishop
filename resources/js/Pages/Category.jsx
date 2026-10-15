import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/Components/ProductCard';
import StorefrontLayout from '@/Components/StorefrontLayout';
import useStorefront from '@/hooks/useStorefront';
import { categoryLabel } from '@/i18n';

export default function Category({ category }) {
    const { t } = useTranslation();
    const { catalog } = usePage().props;
    const categories = catalog?.categories ?? [];
    const [sort, setSort] = useState('recommended');
    const { wishlist, toggleWishlist } = useStorefront();
    const record = categories.find((item) => item.slug === category);
    const title = record
        ? categoryLabel(t, record.slug, record.name)
        : t('nav.collections');
    const categoryProducts = (catalog?.products ?? []).filter(
        (product) => product.categorySlug === category,
    );
    const sortedProducts = [...categoryProducts];

    if (sort === 'price-low') {
        sortedProducts.sort((first, second) => first.price - second.price);
    } else if (sort === 'price-high') {
        sortedProducts.sort((first, second) => second.price - first.price);
    }

    return (
        <StorefrontLayout>
            <Head title={t('category.title', { name: title })} />
            <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 sm:py-12">
                <div className="flex flex-col gap-8 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-4 flex gap-4 text-[10px] uppercase tracking-[0.12em] text-black/50">
                            <Link href="/">{t('category.home')}</Link>
                            <span>/</span>
                            <span>{title}</span>
                        </div>
                        <h1 className="text-3xl font-light uppercase tracking-[0.12em] sm:text-4xl">
                            {title}
                        </h1>
                        <p className="mt-3 max-w-lg text-xs leading-6 text-black/55">
                            {record?.description}
                        </p>
                    </div>
                    <div className="flex gap-5 text-[10px] uppercase tracking-[0.1em]">
                        {categories.map((item) => (
                            <Link
                                key={item.slug}
                                href={route('shop.category', item.slug)}
                                className={
                                    item.slug === category
                                        ? 'border-b border-black pb-1'
                                        : 'pb-1 text-black/50'
                                }
                            >
                                {categoryLabel(t, item.slug, item.name)}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between py-5 text-[10px] uppercase tracking-[0.1em]">
                    <span>
                        {t('category.items', { count: categoryProducts.length })}
                    </span>
                    <label
                        htmlFor="product-sort"
                        className="flex items-center gap-3"
                    >
                        {t('category.sortBy')}
                        <select
                            id="product-sort"
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            className="border-0 bg-transparent py-1 pr-5 text-[10px] uppercase tracking-[0.1em] focus:ring-0"
                        >
                            <option value="recommended">
                                {t('category.recommended')}
                            </option>
                            <option value="price-low">{t('category.priceLow')}</option>
                            <option value="price-high">
                                {t('category.priceHigh')}
                            </option>
                        </select>
                    </label>
                </div>
                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
                        {sortedProducts.map((product) => (
                            <ProductCard
                                key={product.slug}
                                product={product}
                                saved={wishlist.includes(product.slug)}
                                onToggleWishlist={toggleWishlist}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <p className="text-sm">{t('category.comingSoon')}</p>
                        <Link
                            href="/"
                            className="mt-5 inline-block border-b border-black pb-1 text-[10px] uppercase tracking-[0.12em]"
                        >
                            {t('category.return')}
                        </Link>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
