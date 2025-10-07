<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class DeckCollaborator extends Pivot
{
    protected $table = 'deck_collaborators';

    public $timestamps = true;

    protected $fillable = [
        'deck_id',
        'user_id',
    ];

    // If you need relationships, you can still define them
    public function deck()
    {
        return $this->belongsTo(Deck::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
