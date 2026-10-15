import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth.registerTitle')} />

            <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.16em] text-black/50">
                    {t('auth.join')}
                </p>
                <h1 className="mt-3 text-3xl font-light uppercase tracking-[0.1em]">
                    {t('auth.createHeading')}
                </h1>
                <p className="mt-3 text-xs leading-6 text-black/55">
                    {t('auth.registerLead')}
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value={t('auth.name')} />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-2 block w-full px-3 py-3 text-sm"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2 text-xs" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={t('auth.email')} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full px-3 py-3 text-sm"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2 text-xs" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={t('auth.password')} />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full px-3 py-3 text-sm"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 text-xs" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={t('auth.confirmPassword')}
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2 block w-full px-3 py-3 text-sm"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-xs"
                    />
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? t('auth.creating') : t('auth.createHeading')}
                </PrimaryButton>
            </form>
            <p className="mt-8 border-t border-black/10 pt-6 text-center text-xs text-black/60">
                {t('auth.already')}{' '}
                <Link
                    href={route('login')}
                    className="text-black underline underline-offset-4"
                >
                    {t('auth.signIn')}
                </Link>
            </p>
        </GuestLayout>
    );
}
