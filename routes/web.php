<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('home', function () {
        return Inertia::render('dashboard');
    })->name('home');
});

Route::get('/tmp', fn () => Inertia::render('settings/two-factor'));

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
