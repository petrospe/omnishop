<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Shop identity
    |--------------------------------------------------------------------------
    |
    | These values fill the storefront until an administrator saves the same
    | fields under /admin/settings. Prices already stored on products are
    | amounts in SHOP_CURRENCY.
    |
    */

    'currency' => env('SHOP_CURRENCY', 'USD'),

    'company_name' => env('SHOP_COMPANY_NAME', ''),

    'address' => env('SHOP_ADDRESS', ''),

    'city' => env('SHOP_CITY', ''),

    'postal_code' => env('SHOP_POSTAL_CODE', ''),

    'country' => env('SHOP_COUNTRY', 'GR'),

    'phones' => env('SHOP_PHONES', ''),

    'email' => env('SHOP_EMAIL', ''),

    'vat' => env('SHOP_VAT', env('ERP_ISSUER_VAT', '')),

    'registry' => env('SHOP_REGISTRY', ''),

];
