<?php

namespace Database\Seeders;

use App\Models\Deck;
use App\Models\Flashcard;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            [
                'email' => 'admin@example.com',
                'name' => 'Admoon',
                'password' => Hash::make('password4'),
                'email_verified_at' => now(),
            ]
        );

        Deck::factory()->create();

        Flashcard::factory(10)->create();
    }
}
