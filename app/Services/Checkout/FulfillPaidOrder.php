<?php

namespace App\Services\Checkout;

use App\Jobs\SyncOrderToErpJob;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class FulfillPaidOrder
{
    /**
     * Mark a pending order paid and queue the ERP document once.
     *
     * Customer details collected by Stripe replace the placeholder values.
     * A repeated delivery updates those details and does not queue again.
     *
     * @param  array{email?: ?string, name?: ?string, address?: ?string, country?: ?string, vat?: ?string}  $customer
     */
    public function markPaid(Order $order, ?string $sessionId, ?string $paymentIntentId, array $customer = []): void
    {
        DB::transaction(function () use ($order, $sessionId, $paymentIntentId, $customer): void {
            $locked = Order::query()->whereKey($order->id)->lockForUpdate()->first();

            if (! $locked) {
                return;
            }

            $details = $this->customerColumns($customer);
            if (is_string($sessionId) && $sessionId !== '') {
                $details['stripe_session_id'] = $sessionId;
            }
            if (is_string($paymentIntentId) && $paymentIntentId !== '') {
                $details['stripe_payment_intent_id'] = $paymentIntentId;
            }

            if ($locked->status !== 'pending') {
                if ($details !== []) {
                    $locked->update($details);
                }

                return;
            }

            $locked->update([
                ...$details,
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            SyncOrderToErpJob::dispatch($locked->id)->afterCommit();
        });
    }

    /**
     * @param  array<string, mixed>  $session
     * @return array{email: ?string, name: ?string, address: ?string, country: ?string, vat: ?string}
     */
    public function customerFromSession(array $session): array
    {
        $details = is_array($session['customer_details'] ?? null) ? $session['customer_details'] : [];
        $shipping = is_array($session['shipping_details'] ?? null) ? $session['shipping_details'] : [];
        $address = is_array($shipping['address'] ?? null)
            ? $shipping['address']
            : (is_array($details['address'] ?? null) ? $details['address'] : []);
        $name = $shipping['name'] ?? $details['name'] ?? null;
        $email = $details['email'] ?? $session['customer_email'] ?? null;
        $taxIds = is_array($details['tax_ids'] ?? null) ? $details['tax_ids'] : [];
        $vat = is_array($taxIds[0] ?? null) ? ($taxIds[0]['value'] ?? null) : null;

        return [
            'email' => is_string($email) ? $email : null,
            'name' => is_string($name) ? $name : null,
            'address' => $this->addressLine($address),
            'country' => is_string($address['country'] ?? null) ? $address['country'] : null,
            'vat' => is_string($vat) ? $vat : null,
        ];
    }

    /**
     * @param  array{email?: ?string, name?: ?string, address?: ?string, country?: ?string, vat?: ?string}  $customer
     * @return array<string, string>
     */
    private function customerColumns(array $customer): array
    {
        $columns = [];

        if (is_string($customer['email'] ?? null) && $customer['email'] !== '') {
            $columns['email'] = $customer['email'];
        }
        if (is_string($customer['name'] ?? null) && $customer['name'] !== '') {
            $columns['customer_name'] = $customer['name'];
        }
        if (is_string($customer['address'] ?? null) && $customer['address'] !== '') {
            $columns['customer_address'] = mb_substr($customer['address'], 0, 255);
        }
        if (is_string($customer['country'] ?? null) && strlen($customer['country']) === 2) {
            $columns['customer_country'] = strtoupper($customer['country']);
        }
        if (is_string($customer['vat'] ?? null) && $customer['vat'] !== '') {
            $columns['customer_vat'] = mb_substr($customer['vat'], 0, 20);
        }

        return $columns;
    }

    /**
     * @param  array<string, mixed>  $address
     */
    private function addressLine(array $address): ?string
    {
        $parts = array_filter([
            $address['line1'] ?? null,
            $address['line2'] ?? null,
            $address['postal_code'] ?? null,
            $address['city'] ?? null,
        ], fn ($part) => is_string($part) && $part !== '');

        if ($parts === []) {
            return null;
        }

        return implode(', ', $parts);
    }
}
