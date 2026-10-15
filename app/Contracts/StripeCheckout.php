<?php

namespace App\Contracts;

use App\Models\Order;

interface StripeCheckout
{
    /**
     * Open a hosted Checkout Session and return its URL.
     */
    public function start(Order $order): string;

    /**
     * Read a Checkout Session after Stripe redirects the customer back.
     *
     * @return array<string, mixed>
     */
    public function retrieve(string $sessionId): array;
}
