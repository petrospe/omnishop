<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DemoCatalogController as AdminDemoCatalogController;
use App\Http\Controllers\Admin\HomepageController as AdminHomepageController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeWebhookController;
use App\Models\Category;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/stripe/webhook', StripeWebhookController::class)->name('stripe.webhook');

Route::post('/locale', [LocaleController::class, 'update'])->name('locale.update');

Route::get('/', fn () => Inertia::render('Welcome'));

Route::get('/shop/{category}', function (string $category) {
    abort_unless(
        Category::query()->where('slug', $category)->exists(),
        404,
    );

    return Inertia::render('Category', ['category' => $category]);
})->name('shop.category');

Route::get('/product/{slug}', function (string $slug) {
    return Inertia::render('Product', ['slug' => $slug]);
})->name('shop.product');

Route::get('/cart', fn () => Inertia::render('Cart'))->name('cart.index');

Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

Route::get('/wishlist', fn () => Inertia::render('Wishlist'))->name('wishlist.index');

Route::get('/legal/{page}', [LegalController::class, 'show'])
    ->whereIn('page', LegalController::PAGES)
    ->name('legal.show');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::post('demo', [AdminDemoCatalogController::class, 'store'])->name('demo.store');
    Route::delete('demo', [AdminDemoCatalogController::class, 'destroy'])->name('demo.destroy');
    Route::resource('products', AdminProductController::class)->except(['show']);
    Route::resource('categories', AdminCategoryController::class)->except(['show']);
    Route::get('homepage', [AdminHomepageController::class, 'edit'])->name('homepage.edit');
    Route::put('homepage', [AdminHomepageController::class, 'update'])->name('homepage.update');
    Route::get('settings', [AdminSettingsController::class, 'edit'])->name('settings.edit');
    Route::put('settings', [AdminSettingsController::class, 'update'])->name('settings.update');
});

require __DIR__.'/auth.php';
