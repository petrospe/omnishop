<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ShopSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomepageController extends Controller
{
    /**
     * Show the homepage editor.
     */
    public function edit(): Response
    {
        $settings = ShopSetting::current();

        return Inertia::render('Admin/Homepage', [
            'settings' => [
                'announcement' => $settings->announcement,
                'hero_eyebrow' => $settings->hero_eyebrow,
                'hero_title' => $settings->hero_title,
                'hero_image' => $settings->hero_image,
                'hero_image_alt' => $settings->hero_image_alt,
                'hero_button_label' => $settings->hero_button_label,
                'hero_category_id' => $settings->hero_category_id ?? '',
                'collections_eyebrow' => $settings->collections_eyebrow,
                'collections_title' => $settings->collections_title,
                'latest_eyebrow' => $settings->latest_eyebrow,
                'latest_title' => $settings->latest_title,
                'closing_eyebrow' => $settings->closing_eyebrow,
                'closing_text' => $settings->closing_text,
            ],
            'categories' => Category::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                ]),
        ]);
    }

    /**
     * Update the homepage content.
     */
    public function update(Request $request): RedirectResponse
    {
        if ($request->input('hero_category_id') === '') {
            $request->merge(['hero_category_id' => null]);
        }

        $data = $request->validate([
            'announcement' => ['required', 'string', 'max:160'],
            'hero_eyebrow' => ['required', 'string', 'max:80'],
            'hero_title' => ['required', 'string', 'max:200'],
            'hero_image' => ['required', 'url', 'max:2048'],
            'hero_image_alt' => ['required', 'string', 'max:255'],
            'hero_button_label' => ['required', 'string', 'max:80'],
            'hero_category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'collections_eyebrow' => ['required', 'string', 'max:80'],
            'collections_title' => ['required', 'string', 'max:80'],
            'latest_eyebrow' => ['required', 'string', 'max:80'],
            'latest_title' => ['required', 'string', 'max:80'],
            'closing_eyebrow' => ['required', 'string', 'max:120'],
            'closing_text' => ['required', 'string', 'max:240'],
        ]);

        $data['hero_category_id'] = $data['hero_category_id'] ?: null;

        ShopSetting::current()->update($data);

        return redirect()
            ->route('admin.homepage.edit')
            ->with('success', 'Homepage updated.');
    }
}
