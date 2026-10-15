<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display the product list.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::query()
                ->with('category')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (Product $product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float) $product->price,
                    'category' => $product->category->name,
                    'image' => $product->image,
                    'isPublished' => $product->is_published,
                    'sortOrder' => $product->sort_order,
                ]),
        ]);
    }

    /**
     * Show the form for creating a product.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => null,
            'categories' => $this->categoryOptions(),
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request): RedirectResponse
    {
        Product::query()->create($this->validated($request));

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product added to the shop.');
    }

    /**
     * Show the form for editing a product.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category_id' => $product->category_id,
                'price' => (float) $product->price,
                'color' => $product->color,
                'image' => $product->image,
                'image_alt' => $product->image_alt,
                'label' => $product->label ?? '',
                'description' => $product->description,
                'sizes' => implode(', ', $product->sizes ?? []),
                'sort_order' => $product->sort_order,
                'is_published' => $product->is_published,
            ],
            'categories' => $this->categoryOptions(),
        ]);
    }

    /**
     * Update the product.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $product->update($this->validated($request, $product));

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product updated.');
    }

    /**
     * Remove the product from the shop.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product removed.');
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    private function categoryOptions(): array
    {
        return Category::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Product $product = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('products', 'slug')->ignore($product),
            ],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999.99'],
            'color' => ['required', 'string', 'max:80'],
            'image' => ['required', 'url', 'max:2048'],
            'image_alt' => ['required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:40'],
            'description' => ['required', 'string', 'max:2000'],
            'sizes' => ['required', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['boolean'],
        ]);

        $sizes = collect(explode(',', $data['sizes']))
            ->map(fn (string $size) => trim($size))
            ->filter()
            ->values()
            ->all();

        if ($sizes === []) {
            throw ValidationException::withMessages([
                'sizes' => 'Enter at least one size.',
            ]);
        }

        $data['sizes'] = $sizes;
        $data['label'] = $data['label'] !== '' ? $data['label'] : null;
        $data['is_published'] = $request->boolean('is_published');

        return $data;
    }
}
