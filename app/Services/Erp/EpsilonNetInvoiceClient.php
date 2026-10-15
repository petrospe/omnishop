<?php

namespace App\Services\Erp;

class EpsilonNetInvoiceClient extends HttpErpClient
{
    /**
     * Map the fiscal document onto an Epsilon Net / myDATA retail receipt.
     *
     * Invoice type 11.1 is a retail sales receipt. Payment type 7 is POS / e-POS.
     * VAT category 1 is the standard 24% rate.
     *
     * @param  array<string, mixed>  $document
     * @return array<string, mixed>
     */
    protected function body(array $document): array
    {
        return [
            'externalId' => $document['externalId'],
            'issuer' => [
                'vatNumber' => config('services.erp.issuer_vat'),
                'country' => 'GR',
            ],
            'counterpart' => [
                'vatNumber' => $document['customerVat'],
                'name' => $document['customerName'],
                'email' => $document['customerEmail'],
                'address' => [
                    'street' => $document['customerAddress'],
                    'country' => $document['customerCountry'],
                ],
            ],
            'invoiceHeader' => [
                'series' => $document['series'],
                'aa' => $document['externalId'],
                'issueDate' => $document['issueDate'],
                'invoiceType' => $document['invoiceType'],
                'currency' => strtoupper((string) $document['currency']),
            ],
            'paymentMethods' => [[
                'type' => 7,
                'amount' => $document['gross'],
            ]],
            'invoiceSummary' => [
                'totalNetValue' => $document['net'],
                'totalVatAmount' => $document['vat'],
                'totalGrossValue' => $document['gross'],
            ],
            'invoiceDetails' => collect($document['lines'])->map(fn (array $line) => [
                'lineNumber' => $line['position'],
                'itemDescr' => $line['description'],
                'quantity' => $line['quantity'],
                'netValue' => $line['net'],
                'vatCategory' => $line['vatCategory'],
                'vatAmount' => $line['vat'],
            ])->all(),
        ];
    }
}
