<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Support\DemoCatalog;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the shop editor overview.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products' => Product::query()->count(),
                'published' => Product::query()->published()->count(),
                'categories' => Category::query()->count(),
            ],
            'demo' => [
                'present' => DemoCatalog::exists(),
                'complete' => DemoCatalog::isComplete(),
            ],
        ]);
    }
}
