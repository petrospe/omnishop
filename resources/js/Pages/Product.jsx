import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Components/StorefrontLayout';
import { formatPrice, products } from '@/data/products';
import useStorefront from '@/hooks/useStorefront';

export default function Product({ slug }) {
    const product = products.find((item) => item.slug === slug);
    const [added, setAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
    const { addToCart, wishlist, toggleWishlist } = useStorefront();

    if (!product) {
        return (
            <StorefrontLayout>
                <Head title="Product not found" />
                <div className="mx-auto max-w-2xl px-6 py-32 text-center">
                    <h1 className="text-2xl font-light uppercase tracking-[0.1em]">
                        Product not found
                    </h1>
                    <Link
                        href="/"
                        className="mt-6 inline-block border-b border-black pb-1 text-xs uppercase tracking-[0.12em]"
                    >
                        Continue shopping
                    </Link>
                </div>
            </StorefrontLayout>
        );
    }

    const saved = wishlist.includes(product.slug);
    const sizes = ['leather-shoulder-bag', 'sculptural-earrings'].includes(
        product.slug,
    )
        ? ['ONE SIZE']
        : product.slug === 'soft-leather-loafers'
          ? ['40', '41', '42', '43']
          : ['XS', 'S', 'M', 'L'];

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
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link
                        href={route(
                            'shop.category',
                            product.category.toLowerCase(),
                        )}
                    >
                        {product.category}
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
                            {product.category} / NEW COLLECTION
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
                                        ? 'Remove from wishlist'
                                        : 'Add to wishlist'
                                }
                                className="mt-1 shrink-0 text-xl"
                            >
                                {saved ? '♥' : '♡'}
                            </button>
                        </div>
                        <p className="mt-4 text-sm">{formatPrice(product.price)}</p>
                        <p className="mt-2 text-xs text-black/55">
                            Color: {product.color}
                        </p>
                        <div className="mt-10 border-t border-black/10 pt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-[0.12em]">
                                    Select size
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSizeGuideOpen((open) => !open)
                                    }
                                    aria-expanded={sizeGuideOpen}
                                    className="text-[10px] text-black/55 underline underline-offset-4"
                                >
                                    {sizeGuideOpen ? 'Close size guide' : 'Size guide'}
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
                                    Sizes are designed for a relaxed fit. If you
                                    are between sizes, we recommend choosing the
                                    smaller size.
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
                                ? 'Added to your bag'
                                : selectedSize
                                  ? 'Add to bag'
                                  : 'Select a size'}
                        </button>
                        {added && (
                            <Link
                                href={route('cart.index')}
                                className="mt-3 block text-center text-[10px] uppercase tracking-[0.12em] underline underline-offset-4"
                            >
                                View your bag
                            </Link>
                        )}
                        <div className="mt-8 border-t border-black/10 py-6">
                            <h2 className="text-[10px] uppercase tracking-[0.14em]">
                                Product details
                            </h2>
                            <p className="mt-4 text-xs leading-6 text-black/60">
                                An understated essential defined by clean lines
                                and thoughtful proportions. Designed to move
                                easily between everyday moments.
                            </p>
                            <p className="mt-3 text-xs text-black/60">
                                Ref. 0000/{product.slug.slice(0, 4).toUpperCase()}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 border-t border-black/10 py-5 text-[10px] uppercase tracking-[0.1em]">
                            <p>Complimentary shipping over $99</p>
                            <p>Easy returns within 30 days</p>
                        </div>
                    </section>
                </div>
            </div>
        </StorefrontLayout>
    );
}
