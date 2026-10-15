<?php

namespace Tests\Feature;

use App\Http\Controllers\LegalController;
use App\Models\ShopSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopLegalTest extends TestCase
{
    use RefreshDatabase;

    public function test_legal_pages_are_public_and_show_company_details_from_configuration(): void
    {
        config([
            'shop.company_name' => 'Omni Shop IKE',
            'shop.city' => 'Athens',
            'shop.email' => 'hello@omnishop.test',
        ]);

        foreach (LegalController::PAGES as $page) {
            $this->get(route('legal.show', $page))
                ->assertOk()
                ->assertInertia(fn ($inertia) => $inertia
                    ->component('Legal')
                    ->where('page', $page)
                    ->where('shop.company.name', 'Omni Shop IKE')
                    ->where('shop.company.city', 'Athens')
                );
        }
    }

    public function test_an_administrator_can_save_currency_and_company_details(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['is_admin' => true])->save();

        $this->actingAs($admin)
            ->put(route('admin.settings.update'), [
                'currency' => 'eur',
                'company_name' => 'Omni Shop IKE',
                'address' => 'Ermou 1',
                'city' => 'Athens',
                'postal_code' => '10563',
                'country' => 'gr',
                'phones' => "+30 210 000 0000\n+30 690 000 0000",
                'email' => 'hello@omnishop.test',
                'vat' => 'EL123456789',
                'registry' => '123456789000',
            ])
            ->assertRedirect(route('admin.settings.edit'));

        $settings = ShopSetting::current();

        $this->assertSame('EUR', $settings->currency);
        $this->assertSame('Athens', $settings->city);
        $this->assertSame(['+30 210 000 0000', '+30 690 000 0000'], $settings->phoneList());

        $this->get('/')->assertInertia(fn ($page) => $page
            ->where('shop.currency', 'EUR')
            ->where('shop.company.postalCode', '10563')
            ->where('shop.company.vat', 'EL123456789')
        );
    }
}
