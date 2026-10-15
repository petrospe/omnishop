<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Support\DemoCatalog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_and_customers_cannot_open_the_shop_editor(): void
    {
        $this->get(route('admin.dashboard'))->assertRedirect(route('login'));

        $customer = User::factory()->create();

        $this->actingAs($customer)
            ->get(route('admin.dashboard'))
            ->assertForbidden();
    }

    public function test_an_admin_can_change_the_homepage_and_catalog(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['is_admin' => true])->save();

        $category = Category::query()->create([
            'name' => 'WOMAN',
            'slug' => 'woman',
            'image' => 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',
            'image_alt' => 'Tailored look',
            'description' => 'New shapes for the season.',
            'sort_order' => 1,
        ]);

        $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Midnight coat',
            'slug' => 'midnight-coat',
            'category_id' => $category->id,
            'price' => 220,
            'color' => 'Black',
            'image' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
            'image_alt' => 'Black coat',
            'label' => 'NEW',
            'description' => 'A long coat with a quiet shoulder.',
            'sizes' => 'XS, S, M',
            'sort_order' => 1,
            'is_published' => true,
        ])->assertRedirect(route('admin.products.index'));

        $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'Hidden sample',
            'slug' => 'hidden-sample',
            'category_id' => $category->id,
            'price' => 10,
            'color' => 'Grey',
            'image' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
            'image_alt' => 'Grey sample',
            'label' => '',
            'description' => 'Not for the shop.',
            'sizes' => 'ONE SIZE',
            'sort_order' => 2,
            'is_published' => false,
        ])->assertRedirect(route('admin.products.index'));

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->has('catalog.products', 1)
            ->where('catalog.products.0.name', 'Midnight coat')
            ->where('catalog.products.0.sizes', ['XS', 'S', 'M'])
        );

        $this->actingAs($admin)->put(route('admin.homepage.update'), [
            'announcement' => 'Free shipping this week',
            'hero_eyebrow' => 'Autumn edit',
            'hero_title' => "A new\nseason",
            'hero_image' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=90',
            'hero_image_alt' => 'Autumn campaign',
            'hero_button_label' => 'Shop woman',
            'hero_category_id' => $category->id,
            'collections_eyebrow' => 'Explore',
            'collections_title' => 'The rooms',
            'latest_eyebrow' => 'Just in',
            'latest_title' => 'Latest pieces',
            'closing_eyebrow' => 'Worn often',
            'closing_text' => 'Fewer pieces, better ones.',
        ])->assertRedirect(route('admin.homepage.edit'));

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('shop.heroTitle', "A new\nseason")
            ->where('shop.announcement', 'Free shipping this week')
            ->where('shop.heroCategorySlug', 'woman')
        );

        $this->assertSame(2, Product::query()->count());
    }

    public function test_demo_data_is_not_inserted_twice_and_can_be_removed(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['is_admin' => true])->save();

        $this->actingAs($admin)
            ->post(route('admin.demo.store'))
            ->assertRedirect();

        $this->assertSame(3, Category::query()->where('is_demo', true)->count());
        $this->assertSame(8, Product::query()->where('is_demo', true)->count());

        $blazer = Product::query()->where('slug', 'structured-linen-blazer')->first();
        $blazer->update(['name' => 'Edited blazer']);

        $ownCategory = Category::query()->create([
            'name' => 'ARCHIVE',
            'slug' => 'archive',
            'image' => 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',
            'image_alt' => 'Archive',
            'description' => 'Pieces added in the editor.',
            'sort_order' => 9,
            'is_demo' => false,
        ]);
        Product::query()->create([
            'category_id' => $ownCategory->id,
            'name' => 'Archive coat',
            'slug' => 'archive-coat',
            'price' => 200,
            'color' => 'Camel',
            'image' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
            'image_alt' => 'Archive coat',
            'description' => 'Added by the shop editor.',
            'sizes' => ['S', 'M'],
            'sort_order' => 20,
            'is_published' => true,
            'is_demo' => false,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.demo.store'))
            ->assertSessionHas('success', 'Demo data is already in the shop, so nothing was added.');

        $this->assertSame('Edited blazer', $blazer->fresh()->name);
        $this->assertSame(8, Product::query()->where('is_demo', true)->count());

        DemoCatalog::insertMissing();
        $this->assertSame(8, Product::query()->where('is_demo', true)->count());

        $this->actingAs($admin)
            ->delete(route('admin.demo.destroy'))
            ->assertRedirect();

        $this->assertSame(0, Product::query()->where('is_demo', true)->count());
        $this->assertSame(0, Category::query()->where('is_demo', true)->count());
        $this->assertDatabaseHas('products', ['slug' => 'archive-coat']);

        $this->actingAs($admin)->post(route('admin.demo.store'));

        $this->assertSame(8, Product::query()->where('is_demo', true)->count());
        $this->assertSame(3, Category::query()->where('is_demo', true)->count());
        $this->assertDatabaseHas('products', ['slug' => 'archive-coat', 'is_demo' => false]);
    }
}
