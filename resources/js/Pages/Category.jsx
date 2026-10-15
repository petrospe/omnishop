import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/Components/ProductCard';
import StorefrontLayout from '@/Components/StorefrontLayout';
import { categories, products } from '@/data/products';
import useStorefront from '@/hooks/useStorefront';

export default function Category({ category }) {
    const [sort, setSort] = useState('recommended');
    const { wishlist, toggleWishlist } = useStorefront();
    const title =
        categories.find(
            (item) => item.toLowerCase() === category.toLowerCase(),
        ) ?? 'COLLECTION';
    const categoryProducts = products.filter(
        (product) => product.category === title,
    );
    const sortedProducts = [...categoryProducts];

    if (sort === 'price-low') {
        sortedProducts.sort((first, second) => first.price - second.price);
    } else if (sort === 'price-high') {
        sortedProducts.sort((first, second) => second.price - first.price);
    }

    return (
        <StorefrontLayout>
            <Head title={`${title} collection`} />
            <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 sm:py-12">
                <div className="flex flex-col gap-8 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-4 flex gap-4 text-[10px] uppercase tracking-[0.12em] text-black/50">
                            <Link href="/">Home</Link>
                            <span>/</span>
                            <span>{title}</span>
                        </div>
                        <h1 className="text-3xl font-light uppercase tracking-[0.12em] sm:text-4xl">
                            {title}
                        </h1>
                        <p className="mt-3 max-w-lg text-xs leading-6 text-black/55">
                            New shapes and considered essentials for the season
                            ahead.
                        </p>
                    </div>
                    <div className="flex gap-5 text-[10px] uppercase tracking-[0.1em]">
                        {categories.map((item) => (
                            <Link
                                key={item}
                                href={route(
                                    'shop.category',
                                    item.toLowerCase(),
                                )}
                                className={
                                    item === title
                                        ? 'border-b border-black pb-1'
                                        : 'pb-1 text-black/50'
                                }
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between py-5 text-[10px] uppercase tracking-[0.1em]">
                    <span>{categoryProducts.length} items</span>
                    <label
                        htmlFor="product-sort"
                        className="flex items-center gap-3"
                    >
                        Sort by
                        <select
                            id="product-sort"
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            className="border-0 bg-transparent py-1 pr-5 text-[10px] uppercase tracking-[0.1em] focus:ring-0"
                        >
                            <option value="recommended">Recommended</option>
                            <option value="price-low">Price: low to high</option>
                            <option value="price-high">Price: high to low</option>
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
                        <p className="text-sm">This edit is coming soon.</p>
                        <Link
                            href="/"
                            className="mt-5 inline-block border-b border-black pb-1 text-[10px] uppercase tracking-[0.12em]"
                        >
                            Return to the collection
                        </Link>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
