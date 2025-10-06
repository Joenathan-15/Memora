<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    /** @use HasFactory<\Database\Factories\UserInfoFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        "gems",
        "subscription_plan",
        "subscription_start",
        "subscription_end",
        'last_reward_claimed_at',
        'reward_program_started_at',
        'reward_streak_count'
    ];

    protected $casts = [
        'last_reward_claimed_at' => 'datetime',
        'reward_program_started_at' => 'datetime',
    ];

    public function User()
    {
        return $this->belongsTo(User::class);
    }
}
