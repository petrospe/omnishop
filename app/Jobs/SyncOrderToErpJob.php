<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\Erp\ErpInvoiceException;
use App\Services\Erp\ErpInvoiceGateway;
use App\Services\Erp\ErpRejectedException;
use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Support\Facades\Log;
use Throwable;

class SyncOrderToErpJob implements ShouldBeUniqueUntilProcessing, ShouldQueue
{
    use Queueable;

    public int $tries = 5;

    public int $timeout = 60;

    public function __construct(public int $orderId) {}

    /**
     * @return list<int>
     */
    public function backoff(): array
    {
        return [30, 120, 300, 600];
    }

    public function uniqueId(): string
    {
        return (string) $this->orderId;
    }

    /**
     * @return list<WithoutOverlapping>
     */
    public function middleware(): array
    {
        return [(new WithoutOverlapping((string) $this->orderId))->expireAfter(120)];
    }

    public function handle(ErpInvoiceGateway $gateway): void
    {
        $order = Order::query()->with('items')->find($this->orderId);

        if (! $order || $order->status === 'synced') {
            return;
        }

        if (! in_array($order->status, ['paid', 'syncing', 'sync_failed'], true)) {
            return;
        }

        $order->update([
            'status' => 'syncing',
            'erp_last_error' => null,
        ]);

        try {
            $reference = $gateway->issue($order);
        } catch (ErpRejectedException $exception) {
            $this->recordFailure($order, $exception);
            $this->fail($exception);

            return;
        } catch (ErpInvoiceException $exception) {
            $this->recordFailure($order, $exception);

            throw $exception;
        }

        $order->update([
            'status' => 'synced',
            'erp_reference' => $reference,
            'erp_synced_at' => now(),
            'erp_last_error' => null,
        ]);
    }

    public function failed(?Throwable $exception): void
    {
        Log::error('ERP synchronization failed permanently.', [
            'order_id' => $this->orderId,
            'message' => $exception?->getMessage(),
        ]);
    }

    private function recordFailure(Order $order, Throwable $exception): void
    {
        $order->update([
            'status' => 'sync_failed',
            'erp_last_error' => mb_substr($exception->getMessage(), 0, 2000),
        ]);
    }
}
