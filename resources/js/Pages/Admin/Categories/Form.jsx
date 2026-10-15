import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ category }) {
    const { t } = useTranslation();
    const editing = Boolean(category);
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        image: category?.image ?? '',
        image_alt: category?.image_alt ?? '',
        description: category?.description ?? '',
        sort_order: category?.sort_order ?? 0,
    });

    const submit = (event) => {
        event.preventDefault();

        if (editing) {
            put(route('admin.categories.update', category.id));
        } else {
            post(route('admin.categories.store'));
        }
    };

    return (
        <AdminLayout title={editing ? t('admin.editCollection') : t('admin.addCollection')}>
            <Head title={editing ? t('admin.editCollection') : t('admin.addCollection')} />
            <form
                onSubmit={submit}
                className="grid max-w-3xl gap-5 border border-black/10 bg-white p-6"
            >
                <div>
                    <InputLabel value="Name" />
                    <TextInput
                        value={data.name}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('name', event.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="Slug" />
                    <TextInput
                        value={data.slug}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('slug', event.target.value)}
                        required
                    />
                    <p className="mt-1 text-xs text-black/45">
                        Used in the shop URL, for example woman.
                    </p>
                    <InputError message={errors.slug} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="Image URL" />
                    <TextInput
                        type="url"
                        value={data.image}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('image', event.target.value)}
                        required
                    />
                    <InputError message={errors.image} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="Image description" />
                    <TextInput
                        value={data.image_alt}
                        className="mt-1 block w-full"
                        onChange={(event) =>
                            setData('image_alt', event.target.value)
                        }
                        required
                    />
                    <InputError message={errors.image_alt} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="Description" />
                    <textarea
                        value={data.description}
                        onChange={(event) =>
                            setData('description', event.target.value)
                        }
                        rows="3"
                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black"
                        required
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>
                <div>
                    <InputLabel value="Sort order" />
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
                    <InputError message={errors.sort_order} className="mt-2" />
                </div>
                <div>
                    <PrimaryButton disabled={processing}>
                        {editing ? 'Save collection' : 'Add collection'}
                    </PrimaryButton>
                </div>
            </form>
        </AdminLayout>
    );
}
