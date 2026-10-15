<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShopSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        $settings = ShopSetting::current();

        return Inertia::render('Admin/Settings', [
            'settings' => [
                'currency' => $settings->resolved('currency', 'currency', 'USD'),
                'company_name' => $settings->resolved('company_name', 'company_name'),
                'address' => $settings->resolved('address', 'address'),
                'city' => $settings->resolved('city', 'city'),
                'postal_code' => $settings->resolved('postal_code', 'postal_code'),
                'country' => $settings->resolved('country', 'country', 'GR'),
                'phones' => $settings->resolved('phones', 'phones'),
                'email' => $settings->resolved('email', 'email'),
                'vat' => $settings->resolved('vat', 'vat'),
                'registry' => $settings->resolved('registry', 'registry'),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'currency' => ['required', 'string', 'size:3', 'regex:/^[A-Za-z]{3}$/'],
            'company_name' => ['nullable', 'string', 'max:160'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'country' => ['required', 'string', 'size:2', 'regex:/^[A-Za-z]{2}$/'],
            'phones' => ['nullable', 'string', 'max:500'],
            'email' => ['nullable', 'email', 'max:255'],
            'vat' => ['nullable', 'string', 'max:32'],
            'registry' => ['nullable', 'string', 'max:160'],
        ]);

        $data['currency'] = strtoupper($data['currency']);
        $data['country'] = strtoupper($data['country']);

        ShopSetting::current()->update($data);

        return redirect()
            ->route('admin.settings.edit')
            ->with('success', __('settings.updated'));
    }
}
