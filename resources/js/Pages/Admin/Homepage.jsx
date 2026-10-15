import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Homepage({ settings, categories }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm(settings);

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.homepage.update'));
    };

    return (
        <AdminLayout title={t('admin.homepage')}>
            <Head title={t('admin.homepage')} />
            <form
                onSubmit={submit}
                className="grid max-w-3xl gap-5 border border-black/10 bg-white p-6"
            >
                <Field label="Announcement bar" error={errors.announcement}>
                    <TextInput
                        value={data.announcement}
                        className="mt-1 block w-full"
                        onChange={(event) =>
                            setData('announcement', event.target.value)
                        }
                        required
                    />
                </Field>
                <Field label="Hero eyebrow" error={errors.hero_eyebrow}>
                    <TextInput
                        value={data.hero_eyebrow}
                        className="mt-1 block w-full"
                        onChange={(event) =>
                            setData('hero_eyebrow', event.target.value)
                        }
                        required
                    />
                </Field>
                <Field
                    label="Hero title"
                    error={errors.hero_title}
                    hint="Use a new line where the title should break."
                >
                    <textarea
                        value={data.hero_title}
                        onChange={(event) =>
                            setData('hero_title', event.target.value)
                        }
                        rows="3"
                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black"
                        required
                    />
                </Field>
                <Field label="Hero image URL" error={errors.hero_image}>
                    <TextInput
                        type="url"
                        value={data.hero_image}
                        className="mt-1 block w-full"
                        onChange={(event) =>
                            setData('hero_image', event.target.value)
                        }
                        required
                    />
                </Field>
                <Field label="Hero image description" error={errors.hero_image_alt}>
                    <TextInput
                        value={data.hero_image_alt}
                        className="mt-1 block w-full"
                        onChange={(event) =>
                            setData('hero_image_alt', event.target.value)
                        }
                        required
                    />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Button label" error={errors.hero_button_label}>
                        <TextInput
                            value={data.hero_button_label}
                            className="mt-1 block w-full"
                            onChange={(event) =>
                                setData('hero_button_label', event.target.value)
                            }
                            required
                        />
                    </Field>
                    <Field label="Button collection" error={errors.hero_category_id}>
                        <select
                            value={data.hero_category_id}
                            onChange={(event) =>
                                setData('hero_category_id', event.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 focus:border-black focus:ring-black"
                        >
                            <option value="">None</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                        label="Collections eyebrow"
                        error={errors.collections_eyebrow}
                    >
                        <TextInput
                            value={data.collections_eyebrow}
                            className="mt-1 block w-full"
                            onChange={(event) =>
                                setData('collections_eyebrow', event.target.value)
                            }
                            required
                        />
                    </Field>
                    <Field label="Collections title" error={errors.collections_title}>
                        <TextInput
                            value={data.collections_title}
                            className="mt-1 block w-full"
                            onChange={(event) =>
                                setData('collections_title', event.target.value)
                            }
                            required
                        />
                    </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Latest eyebrow" error={errors.latest_eyebrow}>
                        <TextInput
                            value={data.latest_eyebrow}
                            className="mt-1 block w-full"
                            onChange={(event) =>
                                setData('latest_eyebrow', event.target.value)
                            }
                            required
                        />
                    </Field>
                    <Field label="Latest title" error={errors.latest_title}>
                        <TextInput
                            value={data.latest_title}
                            className="mt-1 block w-full"
                            onChange={(event) =>
                                setData('latest_title', event.target.value)
                            }
                            required
                        />
                    </Field>
                </div>
                <Field label="Closing eyebrow" error={errors.closing_eyebrow}>
                    <TextInput
                        value={data.closing_eyebrow}
                        className="mt-1 block w-full"
                        onChange={(event) =>
                            setData('closing_eyebrow', event.target.value)
                        }
                        required
                    />
                </Field>
                <Field label="Closing text" error={errors.closing_text}>
                    <TextInput
                        value={data.closing_text}
                        className="mt-1 block w-full"
                        onChange={(event) =>
                            setData('closing_text', event.target.value)
                        }
                        required
                    />
                </Field>
                <div>
                    <PrimaryButton disabled={processing}>
                        Save homepage
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
