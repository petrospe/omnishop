<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopSetting extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'announcement',
        'hero_eyebrow',
        'hero_title',
        'hero_image',
        'hero_image_alt',
        'hero_button_label',
        'hero_category_id',
        'collections_eyebrow',
        'collections_title',
        'latest_eyebrow',
        'latest_title',
        'closing_eyebrow',
        'closing_text',
        'currency',
        'company_name',
        'address',
        'city',
        'postal_code',
        'country',
        'phones',
        'email',
        'vat',
        'registry',
    ];

    public function heroCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'hero_category_id');
    }

    public static function current(): self
    {
        $settings = static::query()->first();

        if ($settings) {
            return $settings;
        }

        return static::query()->create([
            'announcement' => 'Complimentary shipping on orders over $99',
            'hero_eyebrow' => 'The new collection',
            'hero_title' => "A study in\nquiet form",
            'hero_image' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=90',
            'hero_image_alt' => 'The new season collection',
            'hero_button_label' => 'Discover the collection',
            'collections_eyebrow' => 'Explore the edit',
            'collections_title' => 'New perspectives',
            'latest_eyebrow' => 'Carefully considered',
            'latest_title' => 'The latest edit',
            'closing_eyebrow' => 'Made to be worn, season after season',
            'closing_text' => 'Considered pieces. A little less, a little better.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function toStorefront(): array
    {
        $this->loadMissing('heroCategory');

        return [
            'announcement' => $this->announcement,
            'heroEyebrow' => $this->hero_eyebrow,
            'heroTitle' => $this->hero_title,
            'heroImage' => $this->hero_image,
            'heroImageAlt' => $this->hero_image_alt,
            'heroButtonLabel' => $this->hero_button_label,
            'heroCategorySlug' => $this->heroCategory?->slug,
            'collectionsEyebrow' => $this->collections_eyebrow,
            'collectionsTitle' => $this->collections_title,
            'latestEyebrow' => $this->latest_eyebrow,
            'latestTitle' => $this->latest_title,
            'closingEyebrow' => $this->closing_eyebrow,
            'closingText' => $this->closing_text,
            'currency' => $this->resolved('currency', 'currency', 'USD'),
            'company' => [
                'name' => $this->resolved('company_name', 'company_name'),
                'address' => $this->resolved('address', 'address'),
                'city' => $this->resolved('city', 'city'),
                'postalCode' => $this->resolved('postal_code', 'postal_code'),
                'country' => $this->resolved('country', 'country', 'GR'),
                'phones' => $this->phoneList(),
                'email' => $this->resolved('email', 'email'),
                'vat' => $this->resolved('vat', 'vat'),
                'registry' => $this->resolved('registry', 'registry'),
            ],
        ];
    }

    /**
     * A saved value wins. An empty column falls back to config/shop.php.
     */
    public function resolved(string $column, string $configKey, string $fallback = ''): string
    {
        $stored = $this->{$column};

        if (is_string($stored) && $stored !== '') {
            return $stored;
        }

        $configured = config('shop.'.$configKey, $fallback);

        return is_string($configured) && $configured !== '' ? $configured : $fallback;
    }

    /**
     * @return list<string>
     */
    public function phoneList(): array
    {
        $phones = preg_split('/[\r\n,;]+/', $this->resolved('phones', 'phones')) ?: [];

        return array_values(array_filter(array_map('trim', $phones)));
    }
}
