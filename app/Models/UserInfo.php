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
        "subscription"
    ];

    public function User()
    {
        return $this->belongsTo(User::class);
    }
}
