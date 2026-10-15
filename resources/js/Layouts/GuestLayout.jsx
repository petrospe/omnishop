import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-white text-[#171717]">
            <header className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-10">
                <Link href="/" aria-label="Omnishop home">
                    <img
                        src="/images/omnishop-logo.png"
                        alt="Omnishop"
                        className="h-14 w-14 object-contain"
                    />
                </Link>
                <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.12em]">
                    <Link href={route('login')} className="hidden sm:inline">
                        Log in
                    </Link>
                    <Link href={route('register')}>Create account</Link>
                </div>
            </header>
            <div className="grid min-h-[calc(100vh-69px)] lg:grid-cols-2">
                <div className="relative hidden min-h-[600px] overflow-hidden bg-[#e8e5e0] lg:block">
                    <img
                        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85"
                        alt="Omnishop new season collection"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/15" />
                    <div className="absolute bottom-12 left-12 max-w-sm text-white">
                        <p className="text-[10px] uppercase tracking-[0.2em]">
                            A considered wardrobe
                        </p>
                        <p className="mt-4 text-3xl font-light uppercase leading-tight tracking-[0.08em]">
                            The art of getting dressed.
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-16">
                    <div className="w-full max-w-md">
                        <Link
                            href="/"
                            className="mb-10 inline-block text-[10px] uppercase tracking-[0.12em] text-black/55 hover:text-black"
                        >
                            ← Continue shopping
                        </Link>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
