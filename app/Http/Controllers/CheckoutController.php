<?php

namespace App\Http\Controllers;

use App\Contracts\StripeCheckout;
use App\Models\Order;
use App\Models\Product;
use App\Models\ShopSetting;
use App\Services\Checkout\FulfillPaidOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Exception\ApiErrorException;
use Throwable;

class CheckoutController extends Controller
{
    public function store(Request $request, StripeCheckout $stripe): \Symfony\Component\HttpFoundation\Response
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1', 'max:20'],
            'items.*.slug' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:5'],
            'items.*.size' => ['nullable', 'string', 'max:20'],
        ]);

        $order = $this->createOrder($request, $data['items']);

        try {
            $url = $stripe->start($order);
        } catch (ApiErrorException|Throwable $exception) {
            Log::error('Stripe checkout could not start.', [
                'order' => $order->number,
                'message' => $exception->getMessage(),
            ]);
            $order->items()->delete();
            $order->delete();

            throw ValidationException::withMessages([
                'checkout' => __('checkout.stripe_failed'),
            ]);
        }

        return Inertia::location($url);
    }

    public function success(Request $request, StripeCheckout $stripe, FulfillPaidOrder $fulfill): Response
    {
        $sessionId = $request->string('session_id')->toString();
        abort_unless($sessionId !== '', 404);

        try {
            $session = $stripe->retrieve($sessionId);
        } catch (Throwable $exception) {
            Log::warning('Stripe checkout session could not be read.', [
                'message' => $exception->getMessage(),
            ]);
            abort(404);
        }

        $orderId = $session['metadata']['order_id'] ?? null;
        $order = is_scalar($orderId) ? Order::query()->find($orderId) : null;
        abort_unless($order, 404);

        if (($session['payment_status'] ?? null) === 'paid') {
            $intent = $session['payment_intent'] ?? null;
            $fulfill->markPaid(
                $order,
                is_string($session['id'] ?? null) ? $session['id'] : $sessionId,
                is_string($intent) ? $intent : null,
                $fulfill->customerFromSession($session),
            );
        }

        $order->refresh();

        return Inertia::render('Checkout/Success', [
            'orderNumber' => $order->number,
            'paid' => $order->isPaid(),
            'clearCart' => $order->isPaid(),
        ]);
    }

    public function cancel(): RedirectResponse
    {
        return redirect()
            ->route('cart.index')
            ->withErrors(['checkout' => __('checkout.cancelled')]);
    }

    /**
     * @param  list<array{slug: string, quantity: int, size?: ?string}>  $items
     */
    private function createOrder(Request $request, array $items): Order
    {
        $products = Product::query()
            ->published()
            ->whereIn('slug', collect($items)->pluck('slug'))
            ->get()
            ->keyBy('slug');

        $lines = [];
        $grossCents = 0;
        $netCents = 0;
        $vatCents = 0;
        $rate = (float) config('services.erp.default_vat_rate', 24);

        foreach ($items as $item) {
            $product = $products->get($item['slug']);

            if (! $product) {
                throw ValidationException::withMessages([
                    'checkout' => __('checkout.unavailable'),
                ]);
            }

            $size = trim((string) ($item['size'] ?? ''));
            $sizes = $product->sizes ?: [];

            if ($sizes !== [] && ! in_array($size, $sizes, true)) {
                throw ValidationException::withMessages([
                    'checkout' => __('checkout.choose_size', ['name' => $product->name]),
                ]);
            }

            $unitCents = (int) round(((float) $product->price) * 100);
            $lineGross = $unitCents * $item['quantity'];
            $lineNet = (int) round($lineGross / (1 + ($rate / 100)));
            $grossCents += $lineGross;
            $netCents += $lineNet;
            $vatCents += $lineGross - $lineNet;

            $lines[] = [
                'product_id' => $product->id,
                'name' => $size !== '' ? $product->name.' — '.$size : $product->name,
                'sku' => $size !== '' ? $product->slug.'-'.Str::slug($size) : $product->slug,
                'quantity' => $item['quantity'],
                'unit_price_cents' => $unitCents,
                'vat_rate' => $rate,
            ];
        }

        $user = $request->user();

        return DB::transaction(function () use ($user, $lines, $grossCents, $netCents, $vatCents) {
            $order = Order::query()->create([
                'number' => $this->nextNumber(),
                'user_id' => $user?->id,
                'status' => 'pending',
                'email' => $user?->email ?? 'guest@checkout.invalid',
                'customer_name' => $user?->name ?? 'Guest',
                'customer_country' => 'GR',
                'currency' => strtolower(ShopSetting::current()->resolved('currency', 'currency', 'USD')),
                'subtotal_cents' => $netCents,
                'vat_cents' => $vatCents,
                'total_cents' => $grossCents,
            ]);

            $order->items()->createMany($lines);

            return $order;
        });
    }

    private function nextNumber(): string
    {
        do {
            $number = 'OS-'.now()->format('ymd').'-'.strtoupper(Str::random(4));
        } while (Order::query()->where('number', $number)->exists());

        return $number;
    }
}
