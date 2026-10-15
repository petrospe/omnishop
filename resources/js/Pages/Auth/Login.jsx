import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.16em] text-black/50">
                    Your Omnishop account
                </p>
                <h1 className="mt-3 text-3xl font-light uppercase tracking-[0.1em]">
                    Welcome back
                </h1>
                <p className="mt-3 text-xs leading-6 text-black/55">
                    Sign in to view your orders and saved pieces.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email address" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full px-3 py-3 text-sm"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2 text-xs" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full px-3 py-3 text-sm"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 text-xs" />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-xs text-gray-600">
                            Remember me
                        </span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-gray-600 underline underline-offset-4 hover:text-gray-900"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full" disabled={processing}>
                    {processing ? 'Signing in…' : 'Sign in'}
                </PrimaryButton>
            </form>
            <p className="mt-8 border-t border-black/10 pt-6 text-center text-xs text-black/60">
                New to Omnishop?{' '}
                <Link
                    href={route('register')}
                    className="text-black underline underline-offset-4"
                >
                    Create an account
                </Link>
            </p>
        </GuestLayout>
    );
}
