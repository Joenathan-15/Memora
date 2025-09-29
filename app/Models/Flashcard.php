<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Flashcard extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'question',
        'answer',
        'deck_id',

        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function deck(): BelongsTo {
        return $this->belongsTo(Deck::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(FlashcardReview::class);
    }

    /**
     * Get the review record for a specific user
     */
    public function userReview($userId = null): HasOne
    {
        return $this->hasOne(FlashcardReview::class)
            ->where('user_id', $userId ?? auth()->id());
    }

    /**
     * Get or create a review record for the current user
     */
    public function getOrCreateUserReview($userId = null)
    {
        $userId = $userId ?? auth()->id();

        return FlashcardReview::firstOrCreate(
            [
                'flashcard_id' => $this->id,
                'user_id' => $userId,
            ],
            [
                'next_review_date' => today(),
                'interval' => 1,
                'repetition' => 0,
                'ease_factor' => 2.5,
            ]
        );
    }

    /**
     * Scope to get flashcards due for review
     */
    public function scopeDueForReview($query, $userId = null)
    {
        $userId = $userId ?? auth()->id();

        return $query->whereHas('reviews', function ($q) use ($userId) {
            $q->where('user_id', $userId)
                ->where('next_review_date', '<=', today());
        })->orWhereDoesntHave('reviews', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }
}
