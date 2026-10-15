<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\Checkout\FulfillPaidOrder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function __construct(private FulfillPaidOrder $fulfill) {}

    /**
     * Confirm a paid Checkout session, then queue the ERP invoice.
     *
     * The HTTP response returns before the ERP call. Checkout must create the
     * local order first and put its id in the Checkout Session metadata as
     * order_id. Stripe signs the raw body with STRIPE_WEBHOOK_SECRET.
     */
    public function __invoke(Request $request): Response
    {
        $event = $this->verifiedEvent($request);

        if ($event instanceof Response) {
            return $event;
        }

        $type = $event['type'] ?? null;
        $object = $event['data']['object'] ?? null;

        if (! is_array($object)) {
            return response('Ignored.', 200);
        }

        if ($type === 'checkout.session.completed') {
            return $this->handleCheckoutSession($object);
        }

        if ($type === 'payment_intent.succeeded') {
            return $this->handlePaymentIntent($object);
        }

        return response('Ignored.', 200);
    }

    /**
     * @param  array<string, mixed>  $session
     */
    private function handleCheckoutSession(array $session): Response
    {
        if (($session['payment_status'] ?? null) !== 'paid') {
            return response('Payment is not complete yet.', 200);
        }

        $order = $this->orderFromMetadata($session['metadata'] ?? []);

        if (! $order) {
            Log::warning('Stripe checkout session did not match an order.', [
                'session' => $session['id'] ?? null,
            ]);

            return response('Order not found.', 404);
        }

        $sessionId = is_string($session['id'] ?? null) ? $session['id'] : null;

        if ($order->stripe_session_id && $sessionId && $order->stripe_session_id !== $sessionId) {
            return response('Session does not match this order.', 409);
        }

        $this->fulfill->markPaid(
            $order,
            $sessionId,
            $this->paymentIntentId($session),
            $this->fulfill->customerFromSession($session),
        );

        return response('Accepted.', 200);
    }

    /**
     * @param  array<string, mixed>  $intent
     */
    private function handlePaymentIntent(array $intent): Response
    {
        $order = $this->orderFromMetadata($intent['metadata'] ?? []);

        if (! $order) {
            return response('Ignored.', 200);
        }

        $intentId = is_string($intent['id'] ?? null) ? $intent['id'] : null;

        $this->fulfill->markPaid($order, null, $intentId);

        return response('Accepted.', 200);
    }

    /**
     * @return array<string, mixed>|Response
     */
    private function verifiedEvent(Request $request): array|Response
    {
        $secret = config('services.stripe.webhook_secret');

        if (! is_string($secret) || $secret === '') {
            Log::error('Stripe webhook secret is not configured.');

            return response('Webhook is not configured.', 500);
        }

        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                (string) $request->header('Stripe-Signature'),
                $secret,
            );
        } catch (UnexpectedValueException) {
            return response('Invalid payload.', 400);
        } catch (SignatureVerificationException) {
            return response('Invalid signature.', 400);
        }

        return $event->toArray();
    }

    /**
     * @param  mixed  $metadata
     */
    private function orderFromMetadata(mixed $metadata): ?Order
    {
        if ($metadata instanceof \Stripe\StripeObject) {
            $metadata = $metadata->toArray();
        }

        if (! is_array($metadata) || ! isset($metadata['order_id'])) {
            return null;
        }

        return Order::query()->find($metadata['order_id']);
    }

    /**
     * @param  array<string, mixed>  $session
     */
    private function paymentIntentId(array $session): ?string
    {
        $intent = $session['payment_intent'] ?? null;

        if (is_string($intent)) {
            return $intent;
        }

        if (is_array($intent) && is_string($intent['id'] ?? null)) {
            return $intent['id'];
        }

        return null;
    }

}
