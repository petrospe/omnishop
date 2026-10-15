<?php

namespace Tests\Feature;

use App\Contracts\StripeCheckout;
use App\Jobs\SyncOrderToErpJob;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_creates_a_pending_order_and_redirects_to_stripe(): void
    {
        $product = $this->product();
        $this->app->instance(StripeCheckout::class, new FakeStripeCheckout('https://checkout.stripe.com/c/pay/cs_test_bag'));

        $response = $this->post(route('checkout.store'), [
            'items' => [
                ['slug' => $product->slug, 'quantity' => 1, 'size' => 'M'],
            ],
        ]);

        $response->assertRedirect('https://checkout.stripe.com/c/pay/cs_test_bag');

        $order = Order::query()->first();
        $this->assertNotNull($order);
        $this->assertSame('pending', $order->status);
        $this->assertSame('usd', $order->currency);
        $this->assertSame(14990, $order->total_cents);
        $this->assertSame('cs_test_bag', $order->stripe_session_id);
        $this->assertSame('Structured linen blazer — M', $order->items()->first()->name);
    }

    public function test_a_paid_return_marks_the_order_and_clears_the_path_for_the_bag(): void
    {
        Bus::fake();
        $product = $this->product();
        $order = Order::query()->create([
            'number' => 'OS-1001',
            'status' => 'pending',
            'email' => 'guest@checkout.invalid',
            'customer_name' => 'Guest',
            'currency' => 'usd',
            'subtotal_cents' => 12089,
            'vat_cents' => 2901,
            'total_cents' => 14990,
        ]);
        $order->items()->create([
            'product_id' => $product->id,
            'name' => $product->name,
            'sku' => $product->slug,
            'quantity' => 1,
            'unit_price_cents' => 14990,
            'vat_rate' => 24,
        ]);

        $this->app->instance(StripeCheckout::class, new FakeStripeCheckout('https://checkout.stripe.com/pay', [
            'id' => 'cs_test_paid',
            'payment_status' => 'paid',
            'payment_intent' => 'pi_test_paid',
            'metadata' => ['order_id' => (string) $order->id],
            'customer_details' => [
                'email' => 'ada@example.com',
                'name' => 'Ada Lovelace',
                'address' => [
                    'line1' => 'Ermou 1',
                    'city' => 'Athens',
                    'country' => 'GR',
                ],
            ],
        ]));

        $this->get(route('checkout.success', ['session_id' => 'cs_test_paid']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Checkout/Success')
                ->where('orderNumber', 'OS-1001')
                ->where('paid', true)
                ->where('clearCart', true));

        $order->refresh();
        $this->assertSame('paid', $order->status);
        $this->assertSame('ada@example.com', $order->email);
        $this->assertSame('Ada Lovelace', $order->customer_name);
        Bus::assertDispatched(SyncOrderToErpJob::class);
    }

    public function test_cancel_returns_to_the_bag(): void
    {
        $this->get(route('checkout.cancel'))
            ->assertRedirect(route('cart.index'));
    }

    private function product(): Product
    {
        $category = Category::query()->create([
            'name' => 'Woman',
            'slug' => 'woman',
            'image' => '/images/woman.jpg',
            'image_alt' => 'Woman',
            'description' => 'Collection',
        ]);

        return Product::query()->create([
            'category_id' => $category->id,
            'name' => 'Structured linen blazer',
            'slug' => 'structured-linen-blazer',
            'price' => 149.90,
            'color' => 'Natural white',
            'image' => '/images/blazer.jpg',
            'image_alt' => 'Blazer',
            'description' => 'A blazer',
            'sizes' => ['XS', 'S', 'M', 'L'],
        ]);
    }
}

class FakeStripeCheckout implements StripeCheckout
{
    /**
     * @param  array<string, mixed>  $session
     */
    public function __construct(private string $url, private array $session = []) {}

    public function start(Order $order): string
    {
        $order->update(['stripe_session_id' => 'cs_test_bag']);

        return $this->url;
    }

    public function retrieve(string $sessionId): array
    {
        return $this->session;
    }
}
