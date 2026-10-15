<?php

namespace App\Services\Erp;

use App\Models\Order;

class ErpInvoiceGateway
{
    /**
     * Issue the legal retail document for a paid order.
     *
     * Shelf prices are VAT-inclusive. The net and VAT amounts are split from
     * the gross line so the ERP can file the myDATA record.
     */
    public function issue(Order $order): string
    {
        $order->loadMissing('items');

        $document = $this->document($order);
        $provider = config('services.erp.provider', 'softone');

        $client = $provider === 'epsilonnet'
            ? new EpsilonNetInvoiceClient
            : new SoftOneInvoiceClient;

        return $client->submit($document);
    }

    /**
     * @return array<string, mixed>
     */
    public function document(Order $order): array
    {
        $lines = [];
        $netCents = 0;
        $vatCents = 0;
        $position = 1;

        foreach ($order->items as $item) {
            $gross = $item->grossCents();
            $rate = $item->vat_rate;
            $net = (int) round($gross / (1 + ($rate / 100)));
            $vat = $gross - $net;
            $netCents += $net;
            $vatCents += $vat;

            $lines[] = [
                'position' => $position,
                'sku' => $item->sku,
                'description' => $item->name,
                'quantity' => $item->quantity,
                'vatRate' => $rate,
                'vatCategory' => $this->vatCategory($rate),
                'net' => $this->money($net),
                'vat' => $this->money($vat),
                'gross' => $this->money($gross),
            ];
            $position++;
        }

        return [
            'externalId' => $order->number,
            'issueDate' => now()->toDateString(),
            'currency' => $order->currency,
            'invoiceType' => '11.1',
            'series' => config('services.erp.series', 'A'),
            'customerVat' => $order->customer_vat,
            'customerName' => $order->customer_name,
            'customerEmail' => $order->email,
            'customerAddress' => $order->customer_address,
            'customerCountry' => $order->customer_country,
            'lines' => $lines,
            'net' => $this->money($netCents),
            'vat' => $this->money($vatCents),
            'gross' => $this->money($order->total_cents),
        ];
    }

    private function vatCategory(float $rate): int
    {
        return match ((int) $rate) {
            24 => 1,
            13 => 2,
            6 => 3,
            0 => 7,
            default => 1,
        };
    }

    private function money(int $cents): string
    {
        return number_format($cents / 100, 2, '.', '');
    }
}
