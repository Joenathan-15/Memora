<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class FlashcardReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'flashcard_id',
        'user_id',
        'repetition',
        'ease_factor',
        'interval',
        'next_review_date',
        'last_reviewed_at',
        'quality',
        'review_count',
        'correct_count',
    ];

    protected $casts = [
        'next_review_date' => 'date',
        'last_reviewed_at' => 'datetime',
        'ease_factor' => 'float',
    ];

    public function flashcard(): BelongsTo
    {
        return $this->belongsTo(Flashcard::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Update review data based on SuperMemo 2 algorithm
     *
     * @param int $quality Response quality (0-5 scale)
     *   5 - perfect response
     *   4 - correct response after hesitation
     *   3 - correct response with difficulty
     *   2 - incorrect response; correct one remembered
     *   1 - incorrect response; correct one seemed easy
     *   0 - complete blackout
     */
    public function updateReview(int $quality): void
    {
        $this->review_count++;

        if ($quality >= 3) {
            $this->correct_count++;

            // Calculate new interval based on SM-2 algorithm
            if ($this->repetition == 0) {
                $this->interval = 1;
            } elseif ($this->repetition == 1) {
                $this->interval = 6;
            } else {
                $this->interval = round($this->interval * $this->ease_factor);
            }

            $this->repetition++;
        } else {
            // Reset on incorrect answer
            $this->repetition = 0;
            $this->interval = 1;
        }

        // Update ease factor
        $this->ease_factor = max(1.3, $this->ease_factor + 0.1 - (5 - $quality) * (0.08 + (5 - $quality) * 0.02));

        // Set next review date
        $this->next_review_date = Carbon::today()->addDays($this->interval);
        $this->last_reviewed_at = now();
        $this->quality = $quality;

        $this->save();
    }

    /**
     * Check if the card is due for review
     */
    public function isDue(): bool
    {
        return Carbon::today()->gte($this->next_review_date);
    }

    /**
     * Get cards due for a specific user
     */
    public static function getDueCards($userId, $deckId = null)
    {
        $query = self::where('user_id', $userId)
            ->where('next_review_date', '<=', Carbon::today())
            ->with('flashcard');

        if ($deckId) {
            $query->whereHas('flashcard', function ($q) use ($deckId) {
                $q->where('deck_id', $deckId);
            });
        }

        return $query->orderBy('next_review_date')
            ->orderBy('interval');
    }
}
