<?php

use App\Http\Controllers\DailyRewardController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\ShopController;
use App\Models\Deck;
use App\Services\DailyRewardService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::get('/explore', function () {
    $decks = Deck::select(['uuid', 'title', 'created_at'])->where("is_public", true)->get();
    return Inertia::render('explore', [
        'decks' => $decks
    ]);
})->name('explore');

Route::get('/explore/{uuid}', function (string $uuid) {
    $deck = Deck::where("uuid",$uuid)->with('flashcards')->with("user")->first();
    return Inertia::render("explore/show",[
        "deck" => $deck
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('home', function () {
        $user = auth()->user();

        $decks = Deck::forUser($user->id)
            ->select(['id', 'uuid', 'title', 'created_at'])
            ->withCount('flashcards')
            ->withCount([
                // flashcards that have a review for this user and are due
                'flashcards as due_count' => function ($q) use ($user) {
                    $q->whereHas('reviews', function ($qr) use ($user) {
                        $qr->where('user_id', $user->id)
                            ->where('next_review_date', '<=', now());
                    });
                },
                // flashcards without a review record for this user
                'flashcards as unreviewed_count' => function ($q) use ($user) {
                    $q->whereDoesntHave('reviews', function ($qr) use ($user) {
                        $qr->where('user_id', $user->id);
                    });
                },
            ])
            ->get()
            ->map(function ($deck) {
                $deck->status = ($deck->due_count > 0 || $deck->unreviewed_count > 0) ? 'ready' : 'done';
                return $deck;
            });

        return Inertia::render('dashboard', [
            'decks' => $decks,
            'rewardInfo' => app(DailyRewardService::class)->getUserRewardInfo($user),
        ]);
    })->name('home');

    Route::get('dashboard', function () {
        return redirect()->route('home');
    })->name('dashboard');

    Route::get('/profile', function () {
        $streak = \App\Models\FlashcardReview::getStreak();

        return Inertia::render('profile/index', [
            'streak' => $streak,
        ]);
    });
    Route::get('/profile/edit', fn() => Inertia::render('profile/edit'));

    Route::get('/create', [DeckController::class, 'create'])->name('create');
    Route::post('/create', [DeckController::class, 'store'])->name('store');

    Route::prefix("/decks")->group(function () {
        // Get decks
        Route::get('/{deck}', [DeckController::class, 'show'])->name('decks.show');

        // Import Deck
        Route::post("/import/{uuid}",[DeckController::class,"import"])->name("deck.import");

        // Edit decks
        Route::get('/{deck}/edit', [DeckController::class, 'edit'])->name('decks.edit');
        Route::put('/{id}', [DeckController::class, 'update'])->name('decks.update');

        // Review decks
        Route::post('/{deck}/flashcards/{flashcard}/review', [DeckController::class, 'reviewCard']);
    });

    Route::prefix("/shop")->group(function () {
        // Store decks
        Route::get('/', [ShopController::class, 'index'])->name('shop.index');
        Route::post('/', [ShopController::class, 'purchase'])->name('shop.purchase');
    });


    Route::prefix("/flashcards")->group(function () {
        // Create flashcards
        Route::post('/', [FlashcardController::class, 'store'])->name('flashcards.store');

        // Edit flashcards
        Route::put('/{id}', [FlashcardController::class, 'update'])->name('flashcards.update');

        // Delete flashcards
        Route::delete('/{id}', [FlashcardController::class, 'destroy'])->name('flashcards.destroy');
    });

    Route::post('/daily-reward/claim', [DailyRewardController::class, 'claim']);
    Route::get('/rewards', [DailyRewardController::class, 'show'])->name('rewards');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
