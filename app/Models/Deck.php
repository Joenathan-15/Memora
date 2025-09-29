<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deck extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'uuid',
        'title',
        'description',
        'is_public',
        'user_id',

        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function flashcards(): HasMany {
        return $this->hasMany(Flashcard::class);
    }
}
