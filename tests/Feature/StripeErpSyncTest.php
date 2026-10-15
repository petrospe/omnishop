<?php

namespace Tests\Feature;

use App\Jobs\SyncOrderToErpJob;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\Erp\ErpInvoiceException;
use App\Services\Erp\ErpInvoiceGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class StripeErpSyncTest extends TestCase
{
    use RefreshDatabase;

    private string $secret = 'whsec_test_secret';

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.stripe.webhook_secret' => $this->secret]);
    }

    public function test_a_signed_checkout_event_marks_the_order_paid_and_queues_erp_sync(): void
    {
        Bus::fake();

        $order = $this->order();

        $this->postWebhook($this->checkoutPayload($order))
            ->assertOk();

        $order->refresh();

        $this->assertSame('paid', $order->status);
        $this->assertNotNull($order->paid_at);
        $this->assertSame('cs_test_123', $order->stripe_session_id);
        $this->assertSame('pi_test_123', $order->stripe_payment_intent_id);
        Bus::assertDispatched(SyncOrderToErpJob::class, function (SyncOrderToErpJob $job) use ($order) {
            return $job->orderId === $order->id;
        });
    }

    public function test_a_repeated_payment_event_does_not_queue_another_sync(): void
    {
        Bus::fake();

        $order = $this->order();
        $payload = $this->checkoutPayload($order);

        $this->postWebhook($payload)->assertOk();
        $this->postWebhook($payload)->assertOk();

        Bus::assertDispatchedTimes(SyncOrderToErpJob::class, 1);
    }

    public function test_an_invalid_signature_is_rejected(): void
    {
        Bus::fake();

        $order = $this->order();

        $this->call(
            'POST',
            '/stripe/webhook',
            [],
            [],
            [],
            [
                'HTTP_STRIPE_SIGNATURE' => 't='.time().',v1=deadbeef',
                'CONTENT_TYPE' => 'application/json',
            ],
            json_encode($this->checkoutPayload($order)),
        )->assertStatus(400);

        Bus::assertNothingDispatched();
        $this->assertSame('pending', $order->fresh()->status);
    }

    public function test_the_job_sends_a_retail_receipt_and_stores_the_erp_reference(): void
    {
        config([
            'services.erp.provider' => 'epsilonnet',
            'services.erp.url' => 'https://erp.test/invoices',
            'services.erp.token' => 'token',
            'services.erp.issuer_vat' => '094019245',
            'services.erp.series' => 'A',
        ]);

        Http::fake([
            'https://erp.test/invoices' => Http::response(['mark' => '400001234567890'], 200),
        ]);

        $order = $this->order();
        $order->update(['status' => 'paid', 'paid_at' => now()]);

        (new SyncOrderToErpJob($order->id))->handle(app(ErpInvoiceGateway::class));

        $order->refresh();

        $this->assertSame('synced', $order->status);
        $this->assertSame('400001234567890', $order->erp_reference);
        Http::assertSent(function ($request) use ($order) {
            $body = $request->data();

            return $request->url() === 'https://erp.test/invoices'
                && $request->hasHeader('Idempotency-Key', $order->number)
                && $body['invoiceHeader']['invoiceType'] === '11.1'
                && $body['paymentMethods'][0]['type'] === 7
                && $body['invoiceDetails'][0]['vatCategory'] === 1
                && $body['invoiceSummary']['totalGrossValue'] === '124.00';
        });
    }

    public function test_a_temporary_erp_failure_is_recorded_and_can_be_retried(): void
    {
        config([
            'services.erp.provider' => 'softone',
            'services.erp.url' => 'https://erp.test/softone',
            'services.erp.token' => 'token',
        ]);

        Http::fake([
            'https://erp.test/softone' => Http::sequence()
                ->push('unavailable', 503)
                ->push(['id' => 'SAL-99'], 200),
        ]);

        $order = $this->order();
        $order->update(['status' => 'paid', 'paid_at' => now()]);

        try {
            (new SyncOrderToErpJob($order->id))->handle(app(ErpInvoiceGateway::class));
            $this->fail('The job should raise a retryable ERP error.');
        } catch (ErpInvoiceException $exception) {
            $this->assertStringContainsString('503', $exception->getMessage());
        }

        $this->assertSame('sync_failed', $order->fresh()->status);

        (new SyncOrderToErpJob($order->id))->handle(app(ErpInvoiceGateway::class));

        $this->assertSame('synced', $order->fresh()->status);
        $this->assertSame('SAL-99', $order->fresh()->erp_reference);
    }

    /**
     * @return array<string, mixed>
     */
    private function checkoutPayload(Order $order): array
    {
        return [
            'id' => 'evt_test_123',
            'object' => 'event',
            'api_version' => '2026-01-28.clover',
            'created' => time(),
            'type' => 'checkout.session.completed',
            'livemode' => false,
            'pending_webhooks' => 1,
            'request' => ['id' => null, 'idempotency_key' => null],
            'data' => [
                'object' => [
                    'id' => 'cs_test_123',
                    'object' => 'checkout.session',
                    'payment_status' => 'paid',
                    'payment_intent' => 'pi_test_123',
                    'metadata' => [
                        'order_id' => (string) $order->id,
                    ],
                ],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function postWebhook(array $payload): \Illuminate\Testing\TestResponse
    {
        $body = json_encode($payload);
        $timestamp = time();
        $signature = hash_hmac('sha256', $timestamp.'.'.$body, $this->secret);

        return $this->call(
            'POST',
            '/stripe/webhook',
            [],
            [],
            [],
            [
                'HTTP_STRIPE_SIGNATURE' => 't='.$timestamp.',v1='.$signature,
                'CONTENT_TYPE' => 'application/json',
            ],
            $body,
        );
    }

    private function order(): Order
    {
        $order = Order::query()->create([
            'number' => 'OS-1001',
            'status' => 'pending',
            'email' => 'ada@example.com',
            'customer_name' => 'Ada Lovelace',
            'customer_vat' => null,
            'customer_address' => 'Ermou 1, Athens',
            'customer_country' => 'GR',
            'currency' => 'eur',
            'subtotal_cents' => 10000,
            'vat_cents' => 2400,
            'total_cents' => 12400,
        ]);

        OrderItem::query()->create([
            'order_id' => $order->id,
            'name' => 'Structured linen blazer',
            'sku' => 'structured-linen-blazer',
            'quantity' => 1,
            'unit_price_cents' => 12400,
            'vat_rate' => 24,
        ]);

        return $order;
    }
}
