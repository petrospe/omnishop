<?php

namespace App\Services\Checkout;

use App\Contracts\StripeCheckout;
use App\Models\Order;
use RuntimeException;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class StripeCheckoutGateway implements StripeCheckout
{
    public function start(Order $order): string
    {
        $this->configure();
        $order->loadMissing('items');

        $payload = [
            'mode' => 'payment',
            'client_reference_id' => (string) $order->id,
            'metadata' => [
                'order_id' => (string) $order->id,
            ],
            'payment_intent_data' => [
                'metadata' => [
                    'order_id' => (string) $order->id,
                ],
            ],
            'line_items' => $order->items->map(fn ($item) => [
                'quantity' => $item->quantity,
                'price_data' => [
                    'currency' => $order->currency,
                    'unit_amount' => $item->unit_price_cents,
                    'product_data' => [
                        'name' => $item->name,
                    ],
                ],
            ])->all(),
            'billing_address_collection' => 'required',
            'shipping_address_collection' => [
                'allowed_countries' => ['GR', 'CY', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'IE'],
            ],
            'success_url' => route('checkout.success').'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel'),
        ];

        if ($order->user_id) {
            $payload['customer_email'] = $order->email;
        }

        $session = Session::create($payload);

        $order->update(['stripe_session_id' => $session->id]);

        if (! is_string($session->url) || $session->url === '') {
            throw new RuntimeException('Stripe did not return a checkout URL.');
        }

        return $session->url;
    }

    /**
     * @return array<string, mixed>
     */
    public function retrieve(string $sessionId): array
    {
        $this->configure();

        return Session::retrieve($sessionId)->toArray();
    }

    private function configure(): void
    {
        $secret = config('services.stripe.secret');

        if (! is_string($secret) || $secret === '') {
            throw new RuntimeException('STRIPE_SECRET is not configured.');
        }

        Stripe::setApiKey($secret);
    }
}
