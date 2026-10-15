import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import StorefrontLayout from '@/Components/StorefrontLayout';
import useStorefront from '@/hooks/useStorefront';
import { categoryLabel } from '@/i18n';
import { useFormatPrice } from '@/utils/formatPrice';

export default function Product({ slug }) {
    const { t } = useTranslation();
    const formatPrice = useFormatPrice();
    const { catalog } = usePage().props;
    const product = (catalog?.products ?? []).find((item) => item.slug === slug);
    const [added, setAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
    const { addToCart, wishlist, toggleWishlist } = useStorefront();

    if (!product) {
        return (
            <StorefrontLayout>
                <Head title={t('product.notFound')} />
                <div className="mx-auto max-w-2xl px-6 py-32 text-center">
                    <h1 className="text-2xl font-light uppercase tracking-[0.1em]">
                        {t('product.notFound')}
                    </h1>
                    <Link
                        href="/"
                        className="mt-6 inline-block border-b border-black pb-1 text-xs uppercase tracking-[0.12em]"
                    >
                        {t('product.continue')}
                    </Link>
                </div>
            </StorefrontLayout>
        );
    }

    const saved = wishlist.includes(product.slug);
    const sizes = product.sizes?.length ? product.sizes : ['XS', 'S', 'M', 'L'];

    const handleAddToCart = () => {
        if (!selectedSize) {
            return;
        }

        addToCart(product.slug, 1, selectedSize);
        setAdded(true);
    };

    return (
        <StorefrontLayout>
            <Head title={product.name} />
            <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-8 sm:py-8">
                <div className="mb-6 flex gap-3 text-[10px] uppercase tracking-[0.1em] text-black/50">
                    <Link href="/">{t('product.home')}</Link>
                    <span>/</span>
                    <Link href={route('shop.category', product.categorySlug)}>
                        {categoryLabel(t, product.categorySlug, product.category)}
                    </Link>
                    <span>/</span>
                    <span className="text-black">{product.name}</span>
                </div>
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.58fr)] lg:gap-14">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="aspect-[3/4] overflow-hidden bg-[#f1f0ee]">
                            <img
                                src={product.image}
                                alt={product.imageAlt}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="hidden aspect-[3/4] overflow-hidden bg-[#f1f0ee] sm:block">
                            <img
                                src={product.image}
                                alt=""
                                className="h-full w-full scale-110 object-cover object-center"
                            />
                        </div>
                    </div>
                    <section className="lg:sticky lg:top-8 lg:h-fit lg:pt-5">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-black/50">
                            {categoryLabel(t, product.categorySlug, product.category)}{' '}
                            / {t('product.newCollection')}
                        </p>
                        <div className="mt-4 flex items-start justify-between gap-4">
                            <h1 className="max-w-md text-2xl font-light uppercase leading-snug tracking-[0.07em] sm:text-3xl">
                                {product.name}
                            </h1>
                            <button
                                type="button"
                                onClick={() => toggleWishlist(product.slug)}
                                aria-pressed={saved}
                                aria-label={
                                    saved
                                        ? t('product.removeWishlist')
                                        : t('product.addWishlist')
                                }
                                className="mt-1 shrink-0 text-xl"
                            >
                                {saved ? '♥' : '♡'}
                            </button>
                        </div>
                        <p className="mt-4 text-sm">{formatPrice(product.price)}</p>
                        <p className="mt-2 text-xs text-black/55">
                            {t('product.color', { color: product.color })}
                        </p>
                        <div className="mt-10 border-t border-black/10 pt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-[0.12em]">
                                    {t('product.selectSize')}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSizeGuideOpen((open) => !open)
                                    }
                                    aria-expanded={sizeGuideOpen}
                                    className="text-[10px] text-black/55 underline underline-offset-4"
                                >
                                    {sizeGuideOpen
                                        ? t('product.closeSizeGuide')
                                        : t('product.sizeGuide')}
                                </button>
                            </div>
                            <div className="grid grid-cols-4 border-l border-t border-black/15">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setSelectedSize(size)}
                                        aria-pressed={selectedSize === size}
                                        className={`border-b border-r border-black/15 py-3 text-xs transition ${
                                            selectedSize === size
                                                ? 'bg-black text-white'
                                                : 'hover:bg-black/5'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {sizeGuideOpen && (
                                <p className="mt-4 bg-[#f5f4f2] p-4 text-xs leading-5 text-black/65">
                                    {t('product.sizeGuideBody')}
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={!selectedSize}
                            className="mt-6 w-full bg-black px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/35"
                        >
                            {added
                                ? t('product.added')
                                : selectedSize
                                  ? t('product.addToBag')
                                  : t('product.selectASize')}
                        </button>
                        {added && (
                            <Link
                                href={route('cart.index')}
                                className="mt-3 block text-center text-[10px] uppercase tracking-[0.12em] underline underline-offset-4"
                            >
                                {t('product.viewBag')}
                            </Link>
                        )}
                        <div className="mt-8 border-t border-black/10 py-6">
                            <h2 className="text-[10px] uppercase tracking-[0.14em]">
                                {t('product.details')}
                            </h2>
                            <p className="mt-4 text-xs leading-6 text-black/60">
                                {product.description}
                            </p>
                            <p className="mt-3 text-xs text-black/60">
                                Ref. 0000/{product.slug.slice(0, 4).toUpperCase()}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 border-t border-black/10 py-5 text-[10px] uppercase tracking-[0.1em]">
                            <p>{t('product.shipping')}</p>
                            <p>{t('product.returns')}</p>
                        </div>
                    </section>
                </div>
            </div>
        </StorefrontLayout>
    );
}
