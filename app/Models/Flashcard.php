<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
}
