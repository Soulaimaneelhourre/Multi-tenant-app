<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Note;
use App\Models\User;
use Stancl\Tenancy\Database\Models\Tenant;
use Illuminate\Support\Str;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            tenancy()->initialize($tenant);

            $users = User::all(); // tenant-specific due to tenant context

            foreach ($users as $user) {
                for ($i = 1; $i <= 3; $i++) {
                    Note::create([
                        'title' => "Note $i for {$user->name}",
                        'content' => Str::random(100),
                        'user_id' => $user->id,
                    ]);
                }
            }

            tenancy()->end();
        }
    }
}
