<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\Product;
use App\Models\ShopSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'catalog' => fn () => [
                'categories' => Category::query()
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get()
                    ->map->toStorefront(),
                'products' => Product::query()
                    ->with('category')
                    ->published()
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get()
                    ->map->toStorefront(),
            ],
            'shop' => fn () => ShopSetting::current()->toStorefront(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
        ];
    }
}
