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
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->string('currency', 3)->nullable();
            $table->string('company_name')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 2)->nullable();
            $table->text('phones')->nullable();
            $table->string('email')->nullable();
            $table->string('vat', 32)->nullable();
            $table->string('registry')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shop_settings', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
