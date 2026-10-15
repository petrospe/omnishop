<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'price',
        'color',
        'image',
        'image_alt',
        'label',
        'description',
        'sizes',
        'sort_order',
        'is_published',
        'is_demo',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'sizes' => 'array',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
            'is_demo' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * @return array<string, mixed>
     */
    public function toStorefront(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'category' => $this->category->name,
            'categorySlug' => $this->category->slug,
            'price' => (float) $this->price,
            'color' => $this->color,
            'image' => $this->image,
            'imageAlt' => $this->image_alt,
            'label' => $this->label,
            'description' => $this->description,
            'sizes' => $this->sizes ?: [],
        ];
    }
}
