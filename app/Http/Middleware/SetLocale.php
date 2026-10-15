<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public const COOKIE = 'locale';

    /**
     * Apply the shopper's language from the locale cookie, then Accept-Language.
     */
    public function handle(Request $request, Closure $next): Response
    {
        App::setLocale($this->resolve($request));

        return $next($request);
    }

    private function resolve(Request $request): string
    {
        $supported = $this->supported();
        $cookie = $request->cookie(self::COOKIE);

        if (is_string($cookie) && in_array($cookie, $supported, true)) {
            return $cookie;
        }

        $preferred = $request->getPreferredLanguage($supported);

        if (is_string($preferred) && in_array($preferred, $supported, true)) {
            return $preferred;
        }

        $fallback = config('app.locale', 'en');

        return is_string($fallback) && in_array($fallback, $supported, true) ? $fallback : 'en';
    }

    /**
     * @return list<string>
     */
    private function supported(): array
    {
        $locales = config('app.supported_locales', ['en', 'el']);

        return is_array($locales) ? array_values($locales) : ['en', 'el'];
    }
}
