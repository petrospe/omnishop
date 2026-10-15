import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/Components/ProductCard';
import StorefrontLayout from '@/Components/StorefrontLayout';
import { products } from '@/data/products';
import useStorefront from '@/hooks/useStorefront';

export default function Wishlist() {
    const { wishlist, toggleWishlist } = useStorefront();
    const savedProducts = wishlist
        .map((slug) => products.find((product) => product.slug === slug))
        .filter(Boolean);

    return (
        <StorefrontLayout>
            <Head title="Wishlist" />
            <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-8 sm:py-16">
                <div className="mb-10 flex items-end justify-between border-b border-black/10 pb-5">
                    <div>
                        <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-black/50">
                            Saved for later
                        </p>
                        <h1 className="text-3xl font-light uppercase tracking-[0.1em]">
                            Wishlist
                        </h1>
                    </div>
                    <span className="text-xs text-black/55">
                        {savedProducts.length} items
                    </span>
                </div>
                {savedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
                        {savedProducts.map((product) => (
                            <ProductCard
                                key={product.slug}
                                product={product}
                                saved
                                onToggleWishlist={toggleWishlist}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-sm text-black/65">
                            You have not saved any pieces yet.
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-block border-b border-black pb-1 text-[10px] uppercase tracking-[0.15em]"
                        >
                            Explore the collection
                        </Link>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
