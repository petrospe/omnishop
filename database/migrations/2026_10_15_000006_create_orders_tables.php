<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('pending')->index();
            $table->string('stripe_session_id')->nullable()->unique();
            $table->string('stripe_payment_intent_id')->nullable()->index();
            $table->string('email');
            $table->string('customer_name');
            $table->string('customer_vat', 20)->nullable();
            $table->string('customer_address')->nullable();
            $table->string('customer_country', 2)->default('GR');
            $table->string('currency', 3)->default('eur');
            $table->unsignedInteger('subtotal_cents');
            $table->unsignedInteger('vat_cents');
            $table->unsignedInteger('total_cents');
            $table->timestamp('paid_at')->nullable();
            $table->string('erp_reference')->nullable();
            $table->timestamp('erp_synced_at')->nullable();
            $table->text('erp_last_error')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('sku');
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('unit_price_cents');
            $table->decimal('vat_rate', 5, 2)->default(24);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
