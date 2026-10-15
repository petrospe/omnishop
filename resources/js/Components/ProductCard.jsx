import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useFormatPrice } from '@/utils/formatPrice';

export default function ProductCard({ product, saved, onToggleWishlist }) {
    const { t } = useTranslation();
    const formatPrice = useFormatPrice();
    return (
        <article className="group min-w-0">
            <div className="relative overflow-hidden bg-[#f2f2f0]">
                <Link
                    href={route('shop.product', product.slug)}
                    className="block aspect-[3/4] overflow-hidden"
                >
                    <img
                        src={product.image}
                        alt={product.imageAlt}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                </Link>
                {product.label && (
                    <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[9px] tracking-[0.1em]">
                        {product.label}
                    </span>
                )}
                <button
                    type="button"
                    onClick={() => onToggleWishlist(product.slug)}
                    aria-label={
                        saved
                            ? t('product.cardRemove', { name: product.name })
                            : t('product.cardAdd', { name: product.name })
                    }
                    aria-pressed={saved}
                    className={`absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white transition ${
                        saved ? 'text-black' : 'text-black/60 hover:text-black'
                    }`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill={saved ? 'currentColor' : 'none'}
                        className="h-[17px] w-[17px]"
                        aria-hidden="true"
                    >
                        <path
                            d="M20.4 5.6a5.1 5.1 0 0 0-7.2 0L12 6.8l-1.2-1.2a5.1 5.1 0 0 0-7.2 7.2l1.2 1.2L12 21l7.2-7 1.2-1.2a5.1 5.1 0 0 0 0-7.2Z"
                            stroke="currentColor"
                            strokeWidth="1.3"
                        />
                    </svg>
                </button>
            </div>
            <Link
                href={route('shop.product', product.slug)}
                className="mt-3 flex items-start justify-between gap-3 text-xs"
            >
                <span>{product.name}</span>
                <span className="shrink-0">{formatPrice(product.price)}</span>
            </Link>
            <p className="mt-1 text-[10px] text-black/50">{product.color}</p>
        </article>
    );
}
