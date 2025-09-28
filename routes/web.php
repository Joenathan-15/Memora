<?php

use App\Http\Controllers\DeckController;
use App\Models\Deck;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('home', function () {
        return Inertia::render('dashboard', [
            'decks' => Deck::select(['title', 'created_at'])
                ->where('user_id', auth()->id())
                ->get(),
        ]);
    })->name('home');

    Route::get('dashboard', function () {
        return redirect()->route('home');
    })->name('dashboard');

    Route::get('/create', [DeckController::class, 'create'])->name('create');
    Route::post('/create', [DeckController::class, 'store'])->name('store');
    Route::get('/decks/{deck}/ai-status', [DeckController::class, 'getAiStatus'])->name('decks.ai-status');
});

Route::get('/tmp', fn () => Inertia::render('settings/two-factor'));

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
