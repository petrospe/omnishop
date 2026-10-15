import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatPrice } from '@/utils/formatPrice';

export default function Index({ products }) {
    const remove = (product) => {
        if (confirm(`Remove ${product.name} from the shop?`)) {
            router.delete(route('admin.products.destroy', product.id));
        }
    };

    return (
        <AdminLayout title="Products">
            <Head title="Products" />
            <div className="mb-5 flex justify-end">
                <Link
                    href={route('admin.products.create')}
                    className="bg-black px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-white"
                >
                    Add product
                </Link>
            </div>
            <div className="overflow-x-auto border border-black/10 bg-white">
                <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-black/10 text-[10px] uppercase tracking-[0.12em] text-black/45">
                        <tr>
                            <th className="px-4 py-3 font-medium">Product</th>
                            <th className="px-4 py-3 font-medium">Collection</th>
                            <th className="px-4 py-3 font-medium">Price</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Order</th>
                            <th className="px-4 py-3 font-medium" />
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b border-black/5">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.image}
                                            alt=""
                                            className="h-14 w-11 object-cover"
                                        />
                                        <span>{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{product.category}</td>
                                <td className="px-4 py-3">
                                    {formatPrice(product.price)}
                                </td>
                                <td className="px-4 py-3 text-xs uppercase tracking-[0.08em]">
                                    {product.isPublished ? 'Published' : 'Hidden'}
                                </td>
                                <td className="px-4 py-3">{product.sortOrder}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={route('admin.products.edit', product.id)}
                                        className="text-[10px] uppercase tracking-[0.1em] underline underline-offset-4"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => remove(product)}
                                        className="ml-4 text-[10px] uppercase tracking-[0.1em] text-black/50 underline underline-offset-4"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-4 py-10 text-center text-sm text-black/55"
                                >
                                    No products yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
