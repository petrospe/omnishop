<?php

namespace App\Support;

use App\Models\Category;
use App\Models\Product;
use App\Models\ShopSetting;

class DemoCatalog
{
    /**
     * Insert demo collections and products that are not already stored.
     *
     * @return array{categories: int, products: int}
     */
    public static function insertMissing(): array
    {
        $inserted = ['categories' => 0, 'products' => 0];

        foreach (self::categories() as $category) {
            $record = Category::query()->firstOrCreate(
                ['slug' => $category['slug']],
                [...$category, 'is_demo' => true],
            );

            if ($record->wasRecentlyCreated) {
                $inserted['categories']++;
            }
        }

        foreach (self::products() as $product) {
            $categoryId = Category::query()->where('slug', $product['category'])->value('id');

            if (! $categoryId) {
                continue;
            }

            $record = Product::query()->firstOrCreate(
                ['slug' => $product['slug']],
                [
                    'category_id' => $categoryId,
                    'name' => $product['name'],
                    'price' => $product['price'],
                    'color' => $product['color'],
                    'image' => $product['image'],
                    'image_alt' => $product['image_alt'],
                    'label' => $product['label'],
                    'description' => $product['description'],
                    'sizes' => $product['sizes'],
                    'sort_order' => $product['sort_order'],
                    'is_published' => true,
                    'is_demo' => true,
                ],
            );

            if ($record->wasRecentlyCreated) {
                $inserted['products']++;
            }
        }

        $settings = ShopSetting::current();

        if (! $settings->hero_category_id) {
            $settings->hero_category_id = Category::query()->where('slug', 'woman')->value('id');
            $settings->save();
        }

        return $inserted;
    }

    /**
     * Delete demo products, then demo collections that no longer have products.
     *
     * @return array{products: int, categories: int, categories_kept: int}
     */
    public static function remove(): array
    {
        $products = Product::query()->where('is_demo', true)->delete();

        $categories = Category::query()->where('is_demo', true)->whereDoesntHave('products');
        $kept = Category::query()->where('is_demo', true)->whereHas('products')->count();
        $removedCategories = $categories->delete();

        return [
            'products' => $products,
            'categories' => $removedCategories,
            'categories_kept' => $kept,
        ];
    }

    public static function exists(): bool
    {
        return Category::query()->where('is_demo', true)->exists()
            || Product::query()->where('is_demo', true)->exists();
    }

    public static function isComplete(): bool
    {
        $categorySlugs = array_column(self::categories(), 'slug');
        $productSlugs = array_column(self::products(), 'slug');

        return Category::query()->whereIn('slug', $categorySlugs)->count() === count($categorySlugs)
            && Product::query()->whereIn('slug', $productSlugs)->count() === count($productSlugs);
    }

    /**
     * @return list<array{name: string, slug: string, image: string, image_alt: string, description: string, sort_order: int}>
     */
    public static function categories(): array
    {
        return [
            [
                'name' => 'WOMAN',
                'slug' => 'woman',
                'image' => 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1300&q=85',
                'image_alt' => 'Model in a modern tailored look',
                'description' => 'New shapes and considered essentials for the season ahead.',
                'sort_order' => 1,
            ],
            [
                'name' => 'MAN',
                'slug' => 'man',
                'image' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1300&q=85',
                'image_alt' => 'Model wearing contemporary menswear',
                'description' => 'New shapes and considered essentials for the season ahead.',
                'sort_order' => 2,
            ],
            [
                'name' => 'STUDIO',
                'slug' => 'studio',
                'image' => 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1300&q=85',
                'image_alt' => 'Eveningwear from the Studio collection',
                'description' => 'Limited pieces with a more sculptural line.',
                'sort_order' => 3,
            ],
        ];
    }

    /**
     * @return list<array{slug: string, name: string, category: string, price: float, color: string, image: string, image_alt: string, label: ?string, description: string, sizes: list<string>, sort_order: int}>
     */
    public static function products(): array
    {
        $description = 'An understated essential defined by clean lines and thoughtful proportions. Designed to move easily between everyday moments.';
        $apparel = ['XS', 'S', 'M', 'L'];

        return [
            self::product('structured-linen-blazer', 'Structured linen blazer', 'woman', 149.90, 'Natural white', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85', 'Model wearing a light neutral tailored jacket', 'NEW', $apparel, 1, $description),
            self::product('fluid-trousers', 'Fluid wide-leg trousers', 'woman', 89.90, 'Black', 'https://images.unsplash.com/photo-1506629905607-d9d5c7c54e78?auto=format&fit=crop&w=900&q=85', 'Black tailored trousers styled for an editorial look', null, $apparel, 2, $description),
            self::product('leather-shoulder-bag', 'Leather shoulder bag', 'woman', 119.90, 'Dark brown', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', 'Minimal leather shoulder bag', null, ['ONE SIZE'], 3, $description),
            self::product('oversized-cotton-shirt', 'Oversized cotton shirt', 'man', 79.90, 'Sky blue', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=85', 'Relaxed light blue cotton shirt', 'NEW', $apparel, 4, $description),
            self::product('textured-knit-polo', 'Textured knit polo', 'man', 69.90, 'Ecru', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=85', 'Textured knit polo shirt in a light neutral shade', null, $apparel, 5, $description),
            self::product('soft-leather-loafers', 'Soft leather loafers', 'man', 139.90, 'Black', 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=900&q=85', 'Classic black leather loafers', null, ['40', '41', '42', '43'], 6, $description),
            self::product('draped-midi-dress', 'Draped midi dress', 'studio', 179.90, 'Deep burgundy', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85', 'Elegant draped evening dress', 'LIMITED EDITION', $apparel, 7, $description),
            self::product('sculptural-earrings', 'Sculptural earrings', 'studio', 49.90, 'Gold', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85', 'Sculptural gold-tone earrings', null, ['ONE SIZE'], 8, $description),
        ];
    }

    /**
     * @param  list<string>  $sizes
     * @return array{slug: string, name: string, category: string, price: float, color: string, image: string, image_alt: string, label: ?string, description: string, sizes: list<string>, sort_order: int}
     */
    private static function product(
        string $slug,
        string $name,
        string $category,
        float $price,
        string $color,
        string $image,
        string $imageAlt,
        ?string $label,
        array $sizes,
        int $sortOrder,
        string $description,
    ): array {
        return [
            'slug' => $slug,
            'name' => $name,
            'category' => $category,
            'price' => $price,
            'color' => $color,
            'image' => $image,
            'image_alt' => $imageAlt,
            'label' => $label,
            'description' => $description,
            'sizes' => $sizes,
            'sort_order' => $sortOrder,
        ];
    }
}
