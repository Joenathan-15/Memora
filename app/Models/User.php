<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        "provider",
        "provider_id"
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function UserInfo()
    {
        return $this->hasOne(UserInfo::class);
    }

    public function ownedDecks(): HasMany
    {
        return $this->hasMany(Deck::class, 'user_id');
    }

    public function collaboratedDecks(): BelongsToMany
    {
        return $this->belongsToMany(Deck::class, 'deck_collaborators')
            ->using(DeckCollaborator::class)
            ->withTimestamps();
    }

    public function accessibleDecks()
    {
        return Deck::accessibleBy($this);
    }

    public function hasActiveSubscription(): bool
    {
        if (!$this->UserInfo || !$this->UserInfo->subscription_end) {
            return false;
        }
        return $this->UserInfo->subscription_plan == "super" && Carbon::parse($this->UserInfo->subscription_end)->isFuture();
    }
}
