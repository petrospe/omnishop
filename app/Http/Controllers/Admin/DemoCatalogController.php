<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\DemoCatalog;
use Illuminate\Http\RedirectResponse;

class DemoCatalogController extends Controller
{
    /**
     * Insert demo collections and products that are not already stored.
     */
    public function store(): RedirectResponse
    {
        if (DemoCatalog::isComplete()) {
            return back()->with('success', 'Demo data is already in the shop, so nothing was added.');
        }

        $inserted = DemoCatalog::insertMissing();

        return back()->with(
            'success',
            "Added {$inserted['categories']} demo collections and {$inserted['products']} demo products.",
        );
    }

    /**
     * Remove demo collections and products.
     */
    public function destroy(): RedirectResponse
    {
        if (! DemoCatalog::exists()) {
            return back()->with('success', 'There is no demo data to remove.');
        }

        $removed = DemoCatalog::remove();
        $message = "Removed {$removed['products']} demo products and {$removed['categories']} demo collections.";

        if ($removed['categories_kept'] > 0) {
            $message .= ' Some demo collections were kept because they still contain products you added.';
        }

        return back()->with('success', $message);
    }
}
