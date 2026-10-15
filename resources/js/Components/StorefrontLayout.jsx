import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import useStorefront from '@/hooks/useStorefront';

function BagIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M5 8h14l1 13H4L5 8Z" stroke="currentColor" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                d="M20.4 5.6a5.1 5.1 0 0 0-7.2 0L12 6.8l-1.2-1.2a5.1 5.1 0 0 0-7.2 7.2l1.2 1.2L12 21l7.2-7 1.2-1.2a5.1 5.1 0 0 0 0-7.2Z"
                stroke="currentColor"
            />
        </svg>
    );
}

export default function StorefrontLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { auth, catalog, shop } = usePage().props;
    const categories = catalog?.categories ?? [];
    const { cartCount, wishlist } = useStorefront();

    return (
        <div className="min-h-screen bg-white text-[#171717]">
            <div className="bg-[#f4f4f4] px-4 py-2 text-center text-[10px] uppercase tracking-[0.17em]">
                {shop?.announcement}
            </div>
            <header className="relative z-30 border-b border-black/10 bg-white">
                <div className="mx-auto grid max-w-[1600px] grid-cols-3 items-center px-4 py-5 md:px-8">
                    <div className="flex items-center gap-5">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-expanded={menuOpen}
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em]"
                        >
                            <span className="flex w-5 flex-col gap-[5px]">
                                <span className="h-px w-full bg-black" />
                                <span className="h-px w-3/4 bg-black" />
                            </span>
                            <span className="hidden sm:inline">
                                {menuOpen ? 'Close' : 'Menu'}
                            </span>
                        </button>
                        <nav className="hidden items-center gap-4 text-[11px] uppercase tracking-[0.1em] lg:flex">
                            {categories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={route('shop.category', category.slug)}
                                    className="transition hover:text-black/50"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <Link
                        href="/"
                        className="justify-self-center text-[22px] font-semibold leading-none tracking-[0.2em] sm:text-[28px]"
                        aria-label="Omnishop home"
                    >
                        OMNISHOP
                    </Link>
                    <div className="flex items-center justify-end gap-4 sm:gap-6">
                        {auth?.user?.is_admin && (
                            <Link
                                href={route('admin.dashboard')}
                                className="hidden whitespace-nowrap text-[11px] uppercase tracking-[0.1em] sm:inline"
                            >
                                Edit shop
                            </Link>
                        )}
                        <Link
                            href={auth?.user ? route('profile.edit') : route('login')}
                            className="hidden text-[11px] uppercase tracking-[0.1em] sm:inline"
                        >
                            {auth?.user ? 'Account' : 'Log in'}
                        </Link>
                        <Link
                            href={route('wishlist.index')}
                            className="relative"
                            aria-label={`Wishlist, ${wishlist.length} saved items`}
                        >
                            <HeartIcon />
                            {wishlist.length > 0 && (
                                <span className="absolute -right-2 -top-2 text-[9px]">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link
                            href={route('cart.index')}
                            className="relative"
                            aria-label={`Shopping bag, ${cartCount} items`}
                        >
                            <BagIcon />
                            {cartCount > 0 && (
                                <span className="absolute -right-2 -top-2 text-[9px]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
                <nav className="flex items-center justify-center gap-6 border-t border-black/5 px-4 py-3 text-[10px] uppercase tracking-[0.14em] lg:hidden">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={route('shop.category', category.slug)}
                        >
                            {category.name}
                        </Link>
                    ))}
                </nav>
                {menuOpen && (
                    <>
                        <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 top-[98px] z-30 cursor-default bg-black/20"
                        />
                        <div className="absolute left-0 top-full z-40 w-full border-t border-black/10 bg-white px-6 py-8 shadow-lg md:px-12">
                            <div className="mx-auto grid max-w-[1400px] gap-10 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col gap-4">
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">
                                        Collections
                                    </p>
                                    {categories.map((category) => (
                                        <Link
                                            key={category.slug}
                                            href={route(
                                                'shop.category',
                                                category.slug,
                                            )}
                                            onClick={() => setMenuOpen(false)}
                                            className="text-xl uppercase tracking-[0.04em]"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-4">
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">
                                        Your account
                                    </p>
                                    {auth?.user?.is_admin && (
                                        <Link
                                            href={route('admin.dashboard')}
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Edit shop
                                        </Link>
                                    )}
                                    <Link href={route('login')} onClick={() => setMenuOpen(false)}>
                                        Log in
                                    </Link>
                                    <Link href={route('register')} onClick={() => setMenuOpen(false)}>
                                        Create account
                                    </Link>
                                    <Link href={route('wishlist.index')} onClick={() => setMenuOpen(false)}>
                                        Wishlist
                                    </Link>
                                    <Link href={route('cart.index')} onClick={() => setMenuOpen(false)}>
                                        Shopping bag
                                    </Link>
                                </div>
                                <div className="hidden flex-col gap-3 text-xs leading-6 text-black/60 lg:flex">
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">
                                        A considered wardrobe
                                    </p>
                                    <p>
                                        Modern essentials, considered details,
                                        and new perspectives on everyday style.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </header>
            <main>{children}</main>
            <footer className="mt-20 border-t border-black/10 px-6 py-12">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <Link href="/" aria-label="Omnishop home">
                            <img
                                src="/images/omnishop-logo.png"
                                alt="Omnishop"
                                className="h-16 w-16 object-contain"
                            />
                        </Link>
                        <p className="mt-3 text-xs text-black/55">
                            A considered wardrobe for every day.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.12em]">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={route('shop.category', category.slug)}
                            >
                                {category.name}
                            </Link>
                        ))}
                        <Link href={route('login')}>Customer care</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
