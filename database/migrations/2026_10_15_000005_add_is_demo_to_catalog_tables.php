<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->boolean('is_demo')->default(false);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_demo')->default(false);
        });

        DB::table('categories')->whereIn('slug', ['woman', 'man', 'studio'])->update(['is_demo' => true]);

        DB::table('products')->whereIn('slug', [
            'structured-linen-blazer',
            'fluid-trousers',
            'leather-shoulder-bag',
            'oversized-cotton-shirt',
            'textured-knit-polo',
            'soft-leather-loafers',
            'draped-midi-dress',
            'sculptural-earrings',
        ])->update(['is_demo' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_demo');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('is_demo');
        });
    }
};
