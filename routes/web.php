<?php

use App\Http\Controllers\DeckController;
use App\Models\Deck;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/explore', fn() => Inertia::render('explore'))->name('explore');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('home', function () {
        return Inertia::render('dashboard', [
            'decks' => Deck::select(['uuid', 'title', 'created_at'])->withCount('flashcards')
                ->where('user_id', auth()->id())
                ->get(),
        ]);
    })->name('home');

    Route::get('dashboard', function () {
        return redirect()->route('home');
    })->name('dashboard');

    Route::get('/create', [DeckController::class, 'create'])->name('create');
    Route::post('/create', [DeckController::class, 'store'])->name('store');

    Route::prefix("/decks")->group(function () {
        // Get decks
        Route::get('/{deck}', [DeckController::class, 'show'])->name('decks.show');

        // Edit decks
        Route::get('/{deck}/edit', [DeckController::class, 'edit'])->name('decks.edit');
        Route::put('/{id}', [DeckController::class, 'update'])->name('decks.update');

        // Review decks
        Route::post('/{deck}/flashcards/{flashcard}/review', [DeckController::class, 'reviewCard']);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
