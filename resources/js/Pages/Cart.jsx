import { Head, Link, useForm, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/Components/StorefrontLayout';
import useStorefront from '@/hooks/useStorefront';
import { formatPrice } from '@/utils/formatPrice';

export default function Cart() {
    const { catalog, errors: pageErrors } = usePage().props;
    const products = catalog?.products ?? [];
    const { cart, removeFromCart, setQuantity } = useStorefront();
    const items = Object.entries(cart)
        .map(([key, quantity]) => {
            const [slug, size] = key.split('::');

            return {
            key,
            product: products.find((item) => item.slug === slug),
            quantity,
            size,
            };
        })
        .filter((item) => item.product);
    const subtotal = items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
    );
    const checkout = useForm({});
    const startCheckout = () => {
        checkout.transform(() => ({
            items: items.map(({ product, quantity, size }) => ({
                slug: product.slug,
                quantity,
                size: size || null,
            })),
        }));
        checkout.post(route('checkout.store'));
    };

    return (
        <StorefrontLayout>
            <Head title="Shopping bag" />
            <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8 sm:py-16">
                <div className="mb-10 flex items-end justify-between border-b border-black/10 pb-5">
                    <div>
                        <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-black/50">
                            Your selection
                        </p>
                        <h1 className="text-3xl font-light uppercase tracking-[0.1em]">
                            Shopping bag
                        </h1>
                    </div>
                    <span className="text-xs text-black/55">
                        {items.reduce((count, item) => count + item.quantity, 0)}{' '}
                        items
                    </span>
                </div>
                {items.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-sm text-black/65">
                            Your bag is currently empty.
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-block bg-black px-8 py-4 text-[10px] uppercase tracking-[0.15em] text-white"
                        >
                            Discover the collection
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="flex flex-col">
                            {items.map(({ key, product, quantity, size }) => (
                                <article
                                    key={key}
                                    className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 border-b border-black/10 py-5 first:pt-0 sm:grid-cols-[150px_minmax(0,1fr)_120px] sm:gap-6"
                                >
                                    <Link
                                        href={route('shop.product', product.slug)}
                                        className="aspect-[3/4] overflow-hidden bg-[#f1f0ee]"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.imageAlt}
                                            className="h-full w-full object-cover"
                                        />
                                    </Link>
                                    <div className="flex flex-col items-start">
                                        <Link
                                            href={route(
                                                'shop.product',
                                                product.slug,
                                            )}
                                            className="text-sm"
                                        >
                                            {product.name}
                                        </Link>
                                        <p className="mt-2 text-xs text-black/55">
                                            {product.color}
                                        </p>
                                        {size && (
                                            <p className="mt-2 text-xs text-black/55">
                                                Size: {size}
                                            </p>
                                        )}
                                        <label className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.1em]">
                                            Quantity
                                            <select
                                                value={quantity}
                                                onChange={(event) =>
                                                    setQuantity(
                                                        key,
                                                        Number(event.target.value),
                                                    )
                                                }
                                                className="border-0 border-b border-black/30 bg-transparent py-1 pr-5 text-xs focus:border-black focus:ring-0"
                                                aria-label={`Quantity for ${product.name}`}
                                            >
                                                {[1, 2, 3, 4, 5].map((count) => (
                                                    <option
                                                        key={count}
                                                        value={count}
                                                    >
                                                        {count}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(key)}
                                            className="mt-auto pt-5 text-[10px] uppercase tracking-[0.1em] text-black/50 underline underline-offset-4"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <p className="col-start-2 row-start-1 justify-self-end text-xs sm:col-start-3 sm:row-auto">
                                        {formatPrice(product.price * quantity)}
                                    </p>
                                </article>
                            ))}
                        </div>
                        <aside className="h-fit border-t border-black/15 pt-5">
                            <h2 className="text-sm uppercase tracking-[0.12em]">
                                Summary
                            </h2>
                            <div className="mt-6 flex justify-between text-xs">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <p className="mt-3 text-[11px] leading-5 text-black/55">
                                Prices include VAT. Shipping is collected on
                                the Stripe payment page.
                            </p>
                            {(checkout.errors.checkout || pageErrors?.checkout) && (
                                <p className="mt-4 text-xs leading-5 text-red-700">
                                    {checkout.errors.checkout || pageErrors.checkout}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={startCheckout}
                                disabled={checkout.processing}
                                className="mt-6 block w-full bg-black px-5 py-4 text-center text-[10px] uppercase tracking-[0.14em] text-white transition disabled:opacity-60"
                            >
                                {checkout.processing
                                    ? 'Opening checkout…'
                                    : 'Checkout'}
                            </button>
                            <Link
                                href="/"
                                className="mt-6 block border border-black px-5 py-4 text-center text-[10px] uppercase tracking-[0.14em] transition hover:bg-black hover:text-white"
                            >
                                Continue shopping
                            </Link>
                        </aside>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
