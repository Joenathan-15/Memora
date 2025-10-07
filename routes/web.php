<?php

use App\Http\Controllers\DailyRewardController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\DeckCollaboratorController;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\ShopController;
use App\Models\Deck;
use App\Models\FlashcardReview;
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

Route::get('/explore/{deck:uuid}', function (Deck $deck) {
    $deck->load('flashcards', 'owner');
    return Inertia::render("explore/show", [
        "deck" => $deck
    ]);
});

Route::get('/api/user-search', [DeckCollaboratorController::class, 'search'])->middleware('auth');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('home', function () {
        $user = auth()->user();

        $decks = Deck::accessibleBy($user)
            ->select(['id', 'uuid', 'title', 'created_at', 'user_id'])
            ->withCount('flashcards')
            ->withCount([
                'flashcards as due_count' => function ($q) use ($user) {
                    $q->whereHas('reviews', function ($qr) use ($user) {
                        $qr->where('user_id', $user->id)
                            ->where('next_review_date', '<=', now());
                    });
                },
                'flashcards as unreviewed_count' => function ($q) use ($user) {
                    $q->whereDoesntHave('reviews', function ($qr) use ($user) {
                        $qr->where('user_id', $user->id);
                    });
                },
            ])
            ->get()
            ->map(function ($deck) use ($user) {
                $deck->status = ($deck->due_count > 0 || $deck->unreviewed_count > 0) ? 'ready' : 'done';
                $deck->is_owner = $deck->user_id === $user->id;
                $deck->is_collaborator = !$deck->is_owner;
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
        $user = auth()->user();

        $accessibleDecksCount = Deck::accessibleBy($user)->count();
        $ownedDecksCount = Deck::ownedBy($user)->count();
        $collaboratedDecksCount = Deck::whereCollaborator($user)->count();

        $masteredCards = FlashcardReview::where("user_id", $user->id)->where("quality", 5)->count();
        $user = $user->load("UserInfo");
        $loginStreak = $user->UserInfo->reward_streak_count;

        return Inertia::render('profile/index', [
            'decks' => $accessibleDecksCount,
            'ownedDecks' => $ownedDecksCount,
            'collaboratedDecks' => $collaboratedDecksCount,
            "cardsMastered" => $masteredCards,
            "loginStreak" => $loginStreak
        ]);
    });

    Route::get('/profile/edit', fn() => Inertia::render('profile/edit'));

    Route::get('/create', [DeckController::class, 'create'])->name('create');
    Route::post('/create', [DeckController::class, 'store'])->name('store');

    Route::prefix("/decks")->group(function () {
        Route::get('/{deck:uuid}', [DeckController::class, 'show'])->name('decks.show');

        Route::post("/import/{deck:uuid}", [DeckController::class, "import"])->name("deck.import");

        Route::get('/{deck:uuid}/edit', [DeckController::class, 'edit'])->name('decks.edit');
        Route::put('/{deck:uuid}', [DeckController::class, 'update'])->name('decks.update');

        Route::delete('/{deck:uuid}', [DeckController::class, 'destroy'])->name('decks.destroy');

        Route::post('/{deck:uuid}/flashcards/{flashcard}/review', [DeckController::class, 'reviewCard']);

        Route::prefix('/{deck:uuid}/collaborators')->group(function () {
            Route::get('/', [DeckCollaboratorController::class, 'index'])->name('decks.collaborators.index');
            Route::post('/', [DeckCollaboratorController::class, 'store'])->name('decks.collaborators.store');
            Route::delete('/{user}', [DeckCollaboratorController::class, 'destroy'])->name('decks.collaborators.destroy');
        });
    });

    Route::prefix("/shop")->group(function () {
        Route::get('/', [ShopController::class, 'index'])->name('shop.index');
        Route::post('/', [ShopController::class, 'purchase'])->name('shop.purchase');
    });

    Route::prefix("/flashcards")->group(function () {
        Route::post('/', [FlashcardController::class, 'store'])->name('flashcards.store');
        Route::put('/{flashcard}', [FlashcardController::class, 'update'])->name('flashcards.update');
        Route::delete('/{flashcard}', [FlashcardController::class, 'destroy'])->name('flashcards.destroy');
    });

    Route::post('/daily-reward/claim', [DailyRewardController::class, 'claim']);
    Route::get('/rewards', [DailyRewardController::class, 'show'])->name('rewards');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
