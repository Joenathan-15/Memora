<?php

namespace Database\Factories;

use App\Models\Deck;
use App\Models\Flashcard;
use Illuminate\Database\Eloquent\Factories\Factory;

class FlashcardFactory extends Factory
{
    protected $model = Flashcard::class;

    public function definition(): array
    {
        return [
            'question' => $this->faker->sentence(),
            'answer' => $this->faker->paragraph(),
            'deck_id' => Deck::find(1)->first() ?? Deck::factory()->create()->id,
        ];
    }
}
