<?php

namespace App\Http\Controllers;

use App\Http\Middleware\SetLocale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LocaleController extends Controller
{
    /**
     * Store the language choice for a year and return to the current page.
     */
    public function update(Request $request): RedirectResponse
    {
        $supported = config('app.supported_locales', ['en', 'el']);
        $locale = $request->validate([
            'locale' => ['required', 'string', Rule::in(is_array($supported) ? $supported : ['en', 'el'])],
        ])['locale'];

        return back()->withCookie(cookie(SetLocale::COOKIE, $locale, 60 * 24 * 365));
    }
}
