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
        Schema::create('shop_settings', function (Blueprint $table) {
            $table->id();
            $table->string('announcement');
            $table->string('hero_eyebrow');
            $table->string('hero_title');
            $table->string('hero_image');
            $table->string('hero_image_alt');
            $table->string('hero_button_label');
            $table->foreignId('hero_category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('collections_eyebrow');
            $table->string('collections_title');
            $table->string('latest_eyebrow');
            $table->string('latest_title');
            $table->string('closing_eyebrow');
            $table->string('closing_text');
            $table->timestamps();
        });

        DB::table('shop_settings')->insert([
            'announcement' => 'Complimentary shipping on orders over $99',
            'hero_eyebrow' => 'The new collection',
            'hero_title' => "A study in\nquiet form",
            'hero_image' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=90',
            'hero_image_alt' => 'The new season collection',
            'hero_button_label' => 'Discover the collection',
            'hero_category_id' => null,
            'collections_eyebrow' => 'Explore the edit',
            'collections_title' => 'New perspectives',
            'latest_eyebrow' => 'Carefully considered',
            'latest_title' => 'The latest edit',
            'closing_eyebrow' => 'Made to be worn, season after season',
            'closing_text' => 'Considered pieces. A little less, a little better.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_settings');
    }
};
