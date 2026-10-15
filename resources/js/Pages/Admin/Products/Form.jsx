import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ product, categories }) {
    const editing = Boolean(product);
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        category_id: product?.category_id ?? categories[0]?.id ?? '',
        price: product?.price ?? '',
        color: product?.color ?? '',
        image: product?.image ?? '',
        image_alt: product?.image_alt ?? '',
        label: product?.label ?? '',
        description: product?.description ?? '',
        sizes: product?.sizes ?? 'XS, S, M, L',
        sort_order: product?.sort_order ?? 0,
        is_published: product?.is_published ?? true,
    });

    const submit = (event) => {
        event.preventDefault();

        if (editing) {
            put(route('admin.products.update', product.id));
        } else {
            post(route('admin.products.store'));
        }
    };

    return (
        <AdminLayout title={editing ? 'Edit product' : 'Add product'}>
            <Head title={editing ? 'Edit product' : 'Add product'} />
            <form
                onSubmit={submit}
                className="grid max-w-3xl gap-5 border border-black/10 bg-white p-6"
            >
                <Field label="Name" error={errors.name}>
                    <TextInput
                        value={data.name}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('name', event.target.value)}
                        required
                    />
                </Field>
                <Field
                    label="Slug"
                    error={errors.slug}
                    hint="Lowercase words separated by hyphens. This is the product URL."
                >
                    <TextInput
                        value={data.slug}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('slug', event.target.value)}
                        required
                    />
                </Field>
                <Field label="Collection" error={errors.category_id}>
                    <select
                        value={data.category_id}
                        onChange={(event) =>
                            setData('category_id', event.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black"
                        required
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Price" error={errors.price}>
                        <TextInput
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.price}
                            className="mt-1 block w-full"
                            onChange={(event) =>
                                setData('price', event.target.value)
                            }
                            required
                        />
                    </Field>
                    <Field label="Color" error={errors.color}>
                        <TextInput
                            value={data.color}
                            className="mt-1 block w-full"
                            onChange={(event) =>
                                setData('color', event.target.value)
                            }
                            required
                        />
                    </Field>
                </div>
                <Field label="Image URL" error={errors.image}>
                    <TextInput
                        type="url"
                        value={data.image}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('image', event.target.value)}
                        required
                    />
                </Field>
                <Field label="Image description" error={errors.image_alt}>
                    <TextInput
                        value={data.image_alt}
                        className="mt-1 block w-full"
                        onChange={(event) =>
                            setData('image_alt', event.target.value)
                        }
                        required
                    />
                </Field>
                <Field
                    label="Label"
                    error={errors.label}
                    hint="Optional badge, such as NEW or LIMITED EDITION."
                >
                    <TextInput
                        value={data.label}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('label', event.target.value)}
                    />
                </Field>
                <Field label="Description" error={errors.description}>
                    <textarea
                        value={data.description}
                        onChange={(event) =>
                            setData('description', event.target.value)
                        }
                        rows="4"
                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black"
                        required
                    />
                </Field>
                <Field
                    label="Sizes"
                    error={errors.sizes}
                    hint="Separate sizes with commas."
                >
                    <TextInput
                        value={data.sizes}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('sizes', event.target.value)}
                        required
                    />
                </Field>
                <Field
                    label="Sort order"
                    error={errors.sort_order}
                    hint="Lower numbers appear first. The homepage shows the first four published products."
                >
                    <TextInput
                        type="number"
                        min="0"
                        value={data.sort_order}
                        className="mt-1 block w-full"
                        onChange={(event) =>
                            setData('sort_order', event.target.value)
                        }
                        required
                    />
                </Field>
                <label className="flex items-center gap-3 text-sm">
                    <input
                        type="checkbox"
                        checked={data.is_published}
                        onChange={(event) =>
                            setData('is_published', event.target.checked)
                        }
                        className="border-gray-300 text-black focus:ring-black"
                    />
                    Published on the shop
                </label>
                <div>
                    <PrimaryButton disabled={processing}>
                        {editing ? 'Save product' : 'Add product'}
                    </PrimaryButton>
                </div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, error, hint, children }) {
    return (
        <div>
            <InputLabel value={label} />
            {children}
            {hint && <p className="mt-1 text-xs text-black/45">{hint}</p>}
            <InputError message={error} className="mt-2" />
        </div>
    );
}
