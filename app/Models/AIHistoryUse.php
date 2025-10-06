<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AIHistoryUse extends Model
{
    use SoftDeletes;

    protected $table = 'ai_history_uses';

    protected $fillable = [
        'user_id',
        'deck_id',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function deck(): BelongsTo {
        return $this->belongsTo(Deck::class);
    }
}
