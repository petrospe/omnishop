import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats, demo }) {
    const cards = [
        { label: 'Products', value: stats.products, href: route('admin.products.index') },
        { label: 'Published', value: stats.published, href: route('admin.products.index') },
        { label: 'Collections', value: stats.categories, href: route('admin.categories.index') },
    ];

    return (
        <AdminLayout title="Overview">
            <Head title="Shop editor" />
            <p className="max-w-xl text-sm leading-6 text-black/60">
                Change the products, collections, and homepage copy. The shop
                updates as soon as you save.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {cards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="border border-black/10 bg-white px-5 py-6"
                    >
                        <p className="text-[10px] uppercase tracking-[0.14em] text-black/45">
                            {card.label}
                        </p>
                        <p className="mt-3 text-3xl font-light">{card.value}</p>
                    </Link>
                ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
                <Link
                    href={route('admin.products.create')}
                    className="bg-black px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-white"
                >
                    Add product
                </Link>
                <Link
                    href={route('admin.homepage.edit')}
                    className="border border-black px-5 py-3 text-[10px] uppercase tracking-[0.14em]"
                >
                    Edit homepage
                </Link>
            </div>
            <section className="mt-10 border border-black/10 bg-white p-6">
                <h2 className="text-sm uppercase tracking-[0.12em]">Demo data</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-black/60">
                    Sample collections and products are added on a fresh install.
                    Insert skips anything already stored. Remove deletes only
                    the sample records.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        type="button"
                        disabled={demo.complete}
                        onClick={() => router.post(route('admin.demo.store'))}
                        className="border border-black px-5 py-3 text-[10px] uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:border-black/20 disabled:text-black/35"
                    >
                        Insert demo data
                    </button>
                    <button
                        type="button"
                        disabled={!demo.present}
                        onClick={() => {
                            if (
                                confirm(
                                    'Remove the sample collections and products?',
                                )
                            ) {
                                router.delete(route('admin.demo.destroy'));
                            }
                        }}
                        className="border border-black/20 px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-black/70 disabled:cursor-not-allowed disabled:text-black/30"
                    >
                        Remove demo data
                    </button>
                </div>
            </section>
        </AdminLayout>
    );
}
