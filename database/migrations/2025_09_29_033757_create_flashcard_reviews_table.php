<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flashcard_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flashcard_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Spaced repetition parameters
            $table->integer('repetition')->default(0); // Number of consecutive correct answers
            $table->float('ease_factor')->default(2.5); // How easy the card is (2.5 is default)
            $table->integer('interval')->default(1); // Days until next review
            $table->date('next_review_date')->default(now()); // When to show the card next
            $table->timestamp('last_reviewed_at')->nullable();

            // Performance tracking
            $table->integer('quality')->nullable(); // Last review quality (0-5 scale)
            $table->integer('review_count')->default(0); // Total times reviewed
            $table->integer('correct_count')->default(0); // Times answered correctly

            $table->timestamps();

            // Ensure one review record per user per flashcard
            $table->unique(['flashcard_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flashcard_reviews');
    }
};
