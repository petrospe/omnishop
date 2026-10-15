<?php

namespace App\Services\Erp;

class SoftOneInvoiceClient extends HttpErpClient
{
    /**
     * Map the fiscal document onto a SoftOne sales-document payload.
     *
     * The receiving endpoint is ERP_API_URL. SoftOne installations differ, so
     * the external id is sent for the ERP to ignore a repeated delivery.
     *
     * @param  array<string, mixed>  $document
     * @return array<string, mixed>
     */
    protected function body(array $document): array
    {
        return [
            'service' => 'setData',
            'appId' => config('services.erp.company'),
            'object' => 'SALDOC',
            'externalId' => $document['externalId'],
            'data' => [
                'SALDOC' => [[
                    'SERIES' => $document['series'],
                    'TRNDATE' => $document['issueDate'],
                    'COMMENTS' => 'OmniShop '.$document['externalId'],
                    'VATSTS' => $document['customerVat'],
                    'NAME' => $document['customerName'],
                    'EMAIL' => $document['customerEmail'],
                    'ADDRESS' => $document['customerAddress'],
                    'COUNTRY' => $document['customerCountry'],
                    'PAYMENT' => 7,
                    'SUMAMNT' => $document['gross'],
                ]],
                'ITELINES' => collect($document['lines'])->map(fn (array $line) => [
                    'LINENUM' => $line['position'],
                    'SRCHCODE' => $line['sku'],
                    'MTRLNAME' => $line['description'],
                    'QTY1' => $line['quantity'],
                    'PRICE' => $line['gross'],
                    'VATRATE' => $line['vatRate'],
                    'NETAMNT' => $line['net'],
                    'VATAMNT' => $line['vat'],
                ])->all(),
            ],
        ];
    }
}
