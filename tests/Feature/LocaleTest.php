<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocaleTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_shop_defaults_to_english(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('locale', 'en'));
    }

    public function test_the_accept_language_header_selects_greek(): void
    {
        $this->withHeader('Accept-Language', 'el')
            ->get('/')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('locale', 'el'));
    }

    public function test_the_locale_cookie_is_saved_and_overrides_the_header(): void
    {
        $this->from('/')
            ->post(route('locale.update'), ['locale' => 'el'])
            ->assertRedirect('/')
            ->assertCookie('locale', 'el');

        $this->withCookie('locale', 'el')
            ->withHeader('Accept-Language', 'en')
            ->get('/')
            ->assertInertia(fn ($page) => $page->where('locale', 'el'));
    }

    public function test_an_unknown_locale_is_rejected(): void
    {
        $this->from('/')
            ->post(route('locale.update'), ['locale' => 'fr'])
            ->assertSessionHasErrors('locale');
    }
}
