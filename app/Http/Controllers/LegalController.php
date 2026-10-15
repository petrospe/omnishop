<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    /**
     * Pages required for a consumer shop selling into the EU.
     *
     * @var list<string>
     */
    public const PAGES = [
        'notice',
        'terms',
        'privacy',
        'cookies',
        'withdrawal',
        'shipping',
    ];

    public function show(string $page): Response
    {
        abort_unless(in_array($page, self::PAGES, true), 404);

        return Inertia::render('Legal', [
            'page' => $page,
        ]);
    }
}
