<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TenantSeeder extends Seeder
{
    public function run()
    {
        // Insert tenants directly into database
        DB::table('tenants')->insert([
            [
                'id' => 'company1',
                'data' => '{}',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'company2', 
                'data' => '{}',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // Insert domains
        DB::table('domains')->insert([
            [
                'domain' => 'company1.localhost',
                'tenant_id' => 'company1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'domain' => 'company2.localhost',
                'tenant_id' => 'company2', 
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}