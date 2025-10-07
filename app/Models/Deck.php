<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function collaborators(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'deck_collaborators')
            ->using(DeckCollaborator::class)
            ->withTimestamps();
    }

    public function usersWithAccess(): BelongsToMany
    {
        return $this->collaborators();
    }

    public function flashcards(): HasMany
    {
        return $this->hasMany(Flashcard::class);
    }

    public function isAccessibleBy(User $user): bool
    {
        return $this->user_id === $user->id ||
            $this->collaborators()->where('user_id', $user->id)->exists();
    }

    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    public function isCollaborator(User $user): bool
    {
        return !$this->isOwnedBy($user) &&
            $this->collaborators()->where('user_id', $user->id)->exists();
    }

    public function scopeAccessibleBy($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
                ->orWhereHas('collaborators', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
        });
    }

    public function scopeOwnedBy($query, User $user)
    {
        return $query->where('user_id', $user->id);
    }

    public function scopeWhereCollaborator($query, User $user)
    {
        return $query->whereHas('collaborators', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->where('user_id', '!=', $user->id);
    }

    public function getStatusAttribute()
    {
        if (isset($this->due_count) && isset($this->unreviewed_count)) {
            return ($this->due_count > 0 || $this->unreviewed_count > 0) ? 'ready' : 'done';
        }

        // fallback: compute without loading all flashcards
        $due = $this->flashcards()->whereHas('reviews', function ($q) {
            $q->where('user_id', auth()->id())->where('next_review_date', '<=', now());
        })->exists();

        $unreviewed = $this->flashcards()->whereDoesntHave('reviews', function ($q) {
            $q->where('user_id', auth()->id());
        })->exists();

        return ($due || $unreviewed) ? 'ready' : 'done';
    }
}
