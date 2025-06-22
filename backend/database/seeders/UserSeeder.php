<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use Stancl\Tenancy\Database\Models\Tenant;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            tenancy()->initialize($tenant);

            for ($i = 1; $i <= 5; $i++) {
                User::create([
                    'name' => "User $i - {$tenant->id}",
                    'email' => "user{$i}@{$tenant->id}.com",
                    'password' => Hash::make('password'), // Use "password" as default
                    'tenant_id' => $tenant->id,
                    'email_verified_at' => now(),
                    'remember_token' => Str::random(10),
                    'created_at' => now(),
                ]);
            }

            tenancy()->end();
        }
    }
}
