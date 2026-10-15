import { Link, usePage } from '@inertiajs/react';

const links = [
    { name: 'Overview', route: 'admin.dashboard' },
    { name: 'Products', route: 'admin.products.index' },
    { name: 'Collections', route: 'admin.categories.index' },
    { name: 'Homepage', route: 'admin.homepage.edit' },
];

export default function AdminLayout({ title, children }) {
    const { flash, errors } = usePage().props;
    const current = usePage().url;

    return (
        <div className="min-h-screen bg-[#f6f5f3] text-[#171717]">
            <header className="border-b border-black/10 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/omnishop-logo.png"
                            alt=""
                            className="h-12 w-12 object-contain"
                        />
                        <p className="text-sm uppercase tracking-[0.12em]">
                            Shop editor
                        </p>
                    </div>
                    <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.12em]">
                        <Link href="/">View shop</Link>
                        <Link href={route('logout')} method="post" as="button">
                            Log out
                        </Link>
                    </div>
                </div>
            </header>
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[180px_minmax(0,1fr)]">
                <nav className="flex gap-4 overflow-x-auto lg:flex-col lg:gap-2">
                    {links.map((link) => {
                        const href = route(link.route);
                        const path = new URL(href, window.location.origin)
                            .pathname;
                        const active =
                            link.route === 'admin.dashboard'
                                ? current === '/admin'
                                : current.startsWith(path);

                        return (
                            <Link
                                key={link.route}
                                href={href}
                                className={`whitespace-nowrap border-b pb-1 text-[11px] uppercase tracking-[0.12em] lg:border-b-0 lg:border-l lg:pb-0 lg:pl-3 ${
                                    active
                                        ? 'border-black'
                                        : 'border-transparent text-black/50'
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
                <div>
                    <h1 className="text-2xl font-light uppercase tracking-[0.08em]">
                        {title}
                    </h1>
                    {flash?.success && (
                        <p className="mt-5 border border-black/10 bg-white px-4 py-3 text-sm">
                            {flash.success}
                        </p>
                    )}
                    {errors?.category && (
                        <p className="mt-5 border border-red-200 bg-white px-4 py-3 text-sm text-red-700">
                            {errors.category}
                        </p>
                    )}
                    <div className="mt-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
