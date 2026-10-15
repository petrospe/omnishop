import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ categories }) {
    const remove = (category) => {
        if (confirm(`Remove the ${category.name} collection?`)) {
            router.delete(route('admin.categories.destroy', category.id));
        }
    };

    return (
        <AdminLayout title="Collections">
            <Head title="Collections" />
            <div className="mb-5 flex justify-end">
                <Link
                    href={route('admin.categories.create')}
                    className="bg-black px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-white"
                >
                    Add collection
                </Link>
            </div>
            <div className="overflow-x-auto border border-black/10 bg-white">
                <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-black/10 text-[10px] uppercase tracking-[0.12em] text-black/45">
                        <tr>
                            <th className="px-4 py-3 font-medium">Collection</th>
                            <th className="px-4 py-3 font-medium">Products</th>
                            <th className="px-4 py-3 font-medium">Order</th>
                            <th className="px-4 py-3 font-medium" />
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-b border-black/5">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={category.image}
                                            alt=""
                                            className="h-14 w-11 object-cover"
                                        />
                                        <div>
                                            <p>{category.name}</p>
                                            <p className="text-xs text-black/45">
                                                /shop/{category.slug}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{category.productCount}</td>
                                <td className="px-4 py-3">{category.sortOrder}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={route(
                                            'admin.categories.edit',
                                            category.id,
                                        )}
                                        className="text-[10px] uppercase tracking-[0.1em] underline underline-offset-4"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => remove(category)}
                                        className="ml-4 text-[10px] uppercase tracking-[0.1em] text-black/50 underline underline-offset-4"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
