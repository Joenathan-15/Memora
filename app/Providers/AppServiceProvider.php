<?php

namespace App\Providers;

use App\Listeners\CreateUserInfoEntry;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Deck;
use App\Policies\DeckPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Deck::class, DeckPolicy::class);

        Event::listen(
            CreateUserInfoEntry::class,
        );
    }
}
