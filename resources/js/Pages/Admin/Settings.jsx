import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Settings({ settings }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm(settings);

    const submit = (event) => {
        event.preventDefault();
        put(route('admin.settings.update'));
    };

    return (
        <AdminLayout title={t('admin.settings')}>
            <Head title={t('admin.settings')} />
            <p className="mb-6 max-w-xl text-sm leading-6 text-black/60">
                {t('settings.lead')}
            </p>
            <form
                onSubmit={submit}
                className="grid max-w-3xl gap-5 border border-black/10 bg-white p-6"
            >
                <Field
                    label={t('settings.currency')}
                    hint={t('settings.currencyHint')}
                    error={errors.currency}
                >
                    <TextInput
                        value={data.currency}
                        className="mt-1 block w-full uppercase"
                        maxLength={3}
                        onChange={(event) =>
                            setData('currency', event.target.value.toUpperCase())
                        }
                        required
                    />
                </Field>
                <Field label={t('settings.company')} error={errors.company_name}>
                    <TextInput
                        value={data.company_name}
                        className="mt-1 block w-full"
                        onChange={(event) =>
                            setData('company_name', event.target.value)
                        }
                    />
                </Field>
                <Field label={t('settings.address')} error={errors.address}>
                    <TextInput
                        value={data.address}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('address', event.target.value)}
                    />
                </Field>
                <div className="grid gap-5 sm:grid-cols-3">
                    <Field label={t('settings.city')} error={errors.city}>
                        <TextInput
                            value={data.city}
                            className="mt-1 block w-full"
                            onChange={(event) => setData('city', event.target.value)}
                        />
                    </Field>
                    <Field label={t('settings.postalCode')} error={errors.postal_code}>
                        <TextInput
                            value={data.postal_code}
                            className="mt-1 block w-full"
                            onChange={(event) =>
                                setData('postal_code', event.target.value)
                            }
                        />
                    </Field>
                    <Field label={t('settings.country')} error={errors.country}>
                        <TextInput
                            value={data.country}
                            className="mt-1 block w-full uppercase"
                            maxLength={2}
                            onChange={(event) =>
                                setData('country', event.target.value.toUpperCase())
                            }
                            required
                        />
                    </Field>
                </div>
                <Field
                    label={t('settings.phones')}
                    hint={t('settings.phonesHint')}
                    error={errors.phones}
                >
                    <textarea
                        value={data.phones}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 text-sm shadow-sm focus:border-black focus:ring-black"
                        onChange={(event) => setData('phones', event.target.value)}
                    />
                </Field>
                <Field label={t('settings.email')} error={errors.email}>
                    <TextInput
                        type="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('email', event.target.value)}
                    />
                </Field>
                <Field label={t('settings.vat')} error={errors.vat}>
                    <TextInput
                        value={data.vat}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('vat', event.target.value)}
                    />
                </Field>
                <Field label={t('settings.registry')} error={errors.registry}>
                    <TextInput
                        value={data.registry}
                        className="mt-1 block w-full"
                        onChange={(event) => setData('registry', event.target.value)}
                    />
                </Field>
                <div>
                    <PrimaryButton disabled={processing}>
                        {t('settings.save')}
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
