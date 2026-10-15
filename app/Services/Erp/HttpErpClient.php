<?php

namespace App\Services\Erp;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class HttpErpClient
{
    /**
     * Submit a canonical fiscal document and return the provider reference.
     *
     * @param  array<string, mixed>  $document
     */
    public function submit(array $document): string
    {
        $url = config('services.erp.url');

        if (! is_string($url) || $url === '') {
            throw new ErpRejectedException('ERP_API_URL is not configured.');
        }

        try {
            $pending = Http::timeout((int) config('services.erp.timeout', 20))
                ->acceptJson()
                ->withHeaders([
                    'Idempotency-Key' => (string) $document['externalId'],
                ]);

            $token = config('services.erp.token');

            if (is_string($token) && $token !== '') {
                $pending = $pending->withToken($token);
            }

            $response = $pending->post($url, $this->body($document));
        } catch (ConnectionException $exception) {
            Log::error('ERP request could not connect.', [
                'order' => $document['externalId'] ?? null,
                'message' => $exception->getMessage(),
            ]);

            throw new ErpInvoiceException('ERP connection failed.', previous: $exception);
        }

        return $this->referenceFrom($response, (string) ($document['externalId'] ?? ''));
    }

    /**
     * @param  array<string, mixed>  $document
     * @return array<string, mixed>
     */
    abstract protected function body(array $document): array;

    protected function referenceFrom(Response $response, string $externalId): string
    {
        if ($response->serverError() || $response->status() === 429) {
            Log::warning('ERP request will be retried.', [
                'order' => $externalId,
                'status' => $response->status(),
                'body' => mb_substr($response->body(), 0, 2000),
            ]);

            throw new ErpInvoiceException('ERP returned a retryable error (HTTP '.$response->status().').');
        }

        if ($response->failed()) {
            Log::error('ERP rejected the fiscal document.', [
                'order' => $externalId,
                'status' => $response->status(),
                'body' => mb_substr($response->body(), 0, 2000),
            ]);

            throw new ErpRejectedException('ERP rejected the document (HTTP '.$response->status().').');
        }

        $reference = $response->json('mark')
            ?? $response->json('reference')
            ?? $response->json('id')
            ?? $response->json('data.id');

        if (! is_scalar($reference) || (string) $reference === '') {
            Log::error('ERP response did not include a document reference.', [
                'order' => $externalId,
                'body' => mb_substr($response->body(), 0, 2000),
            ]);

            throw new ErpInvoiceException('ERP response did not include a document reference.');
        }

        Log::info('ERP accepted the fiscal document.', [
            'order' => $externalId,
            'reference' => (string) $reference,
        ]);

        return (string) $reference;
    }
}
