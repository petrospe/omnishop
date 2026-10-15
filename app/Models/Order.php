<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'number',
        'user_id',
        'status',
        'stripe_session_id',
        'stripe_payment_intent_id',
        'email',
        'customer_name',
        'customer_vat',
        'customer_address',
        'customer_country',
        'currency',
        'subtotal_cents',
        'vat_cents',
        'total_cents',
        'paid_at',
        'erp_reference',
        'erp_synced_at',
        'erp_last_error',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtotal_cents' => 'integer',
            'vat_cents' => 'integer',
            'total_cents' => 'integer',
            'paid_at' => 'datetime',
            'erp_synced_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function isPaid(): bool
    {
        return in_array($this->status, ['paid', 'syncing', 'synced', 'sync_failed'], true);
    }
}
