<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    public function handleGithubAuthRedirect()
    {
        return Socialite::driver("github")->redirect();
    }

    public function handleGithubAuthCallBack()
    {
        $oauthUser = Socialite::driver("github")->user();

        $user = User::where('email', $oauthUser->email)->first();

        if (!$user) {
            $user = User::create([
                'email' => $oauthUser->email,
                "name" => $oauthUser->name,
                "provider_id" => $oauthUser->id,
                'provider' => 'github'
            ]);
            event(new Registered($user));
        } else {
            $user->update([
                "name" => $oauthUser->name,
                "provider_id" => $oauthUser->id,
                'provider' => 'github'
            ]);
        }

        Auth::login($user);
        return redirect("dashboard");
    }

    public function handleGoogleAuthRedirect()
    {
        return Socialite::driver("google")->redirect();
    }

    public function handleGoogleAuthCallBack()
    {
        $oauthUser = Socialite::driver("google")->user();

        $user = User::where('email', $oauthUser->email)->first();

        if (!$user) {
            $user = User::create([
                'email' => $oauthUser->email,
                "name" => $oauthUser->name,
                "provider_id" => $oauthUser->id,
                'provider' => 'google'
            ]);
            event(new Registered($user));
        } else {
            $user->update([
                "name" => $oauthUser->name,
                "provider_id" => $oauthUser->id,
                'provider' => 'google'
            ]);
        }

        Auth::login($user);
        return redirect("dashboard");
    }
}
