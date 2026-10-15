<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display the collection list.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::query()
                ->withCount('products')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'image' => $category->image,
                    'productCount' => $category->products_count,
                    'sortOrder' => $category->sort_order,
                ]),
        ]);
    }

    /**
     * Show the form for creating a collection.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => null,
        ]);
    }

    /**
     * Store a newly created collection.
     */
    public function store(Request $request): RedirectResponse
    {
        Category::query()->create($this->validated($request));

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Collection added.');
    }

    /**
     * Show the form for editing a collection.
     */
    public function edit(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'image' => $category->image,
                'image_alt' => $category->image_alt,
                'description' => $category->description,
                'sort_order' => $category->sort_order,
            ],
        ]);
    }

    /**
     * Update the collection.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $category->update($this->validated($request, $category));

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Collection updated.');
    }

    /**
     * Remove a collection that has no products.
     */
    public function destroy(Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            return back()->withErrors([
                'category' => 'Move or delete the products in this collection before removing it.',
            ]);
        }

        $category->delete();

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Collection removed.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Category $category = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'slug' => [
                'required',
                'string',
                'max:80',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('categories', 'slug')->ignore($category),
            ],
            'image' => ['required', 'url', 'max:2048'],
            'image_alt' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ]);
    }
}
