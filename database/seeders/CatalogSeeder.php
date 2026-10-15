<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\DemoCatalog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CatalogSeeder extends Seeder
{
    /**
     * Seed the shop editor account and the demo catalog.
     */
    public function run(): void
    {
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@omnishop.test'],
            [
                'name' => 'Omnishop Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );
        $admin->forceFill(['is_admin' => true])->save();

        DemoCatalog::insertMissing();
    }
}
