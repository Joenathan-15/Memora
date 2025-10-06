<?php

namespace App\Services;

use App\Models\User;

class DailyRewardService
{
    public function canClaimReward(User $user): bool
    {
        if (!$user->userInfo->last_reward_claimed_at) {
            return true;
        }

        return $user->userInfo->last_reward_claimed_at->diffInHours(now()) >= 24;
    }

    public function calculateBaseGems(User $user): int
    {
        $startDate = $user->userInfo->reward_program_started_at ?? now();
        $monthsActive = $startDate->diffInMonths(now());

        // start with 5 gems, increase by 1 each month
        return 5 + $monthsActive;
    }

    public function calculateFinalGems(User $user): int
    {
        $baseGems = $this->calculateBaseGems($user);

        // subscribed users get 50% more gems
        if ($user->hasActiveSubscription()) {
            return (int) ($baseGems * 1.5);
        }

        return $baseGems;
    }

    public function claimDailyReward(User $user): array
    {
        if (!$this->canClaimReward($user)) {
            return [
                'success' => false,
                'message' => 'You have already claimed your daily reward today. Come back tomorrow!',
                'gems_awarded' => 0
            ];
        }

        $gemsAwarded = $this->calculateFinalGems($user);
        $isNewStreak = !$user->userInfo->last_reward_claimed_at?->isYesterday();

        $user->userInfo->update([
            'gems' => $user->userInfo->gems + $gemsAwarded,
            'last_reward_claimed_at' => now(),
            'reward_program_started_at' => $user->userInfo->reward_program_started_at ?? now(),
            'reward_streak_count' => $isNewStreak ? 1 : $user->userInfo->reward_streak_count + 1,
        ]);

        return [
            'success' => true,
            'message' => "Success! You received {$gemsAwarded} gems!",
            'gems_awarded' => $gemsAwarded,
            'total_gems' => $user->userInfo->gems,
            'streak_count' => $user->userInfo->reward_streak_count,
            'next_claim_available' => now()->addDay()->startOfDay(),
            'has_subscription' => $user->hasActiveSubscription(),
            'base_gems' => $this->calculateBaseGems($user)
        ];
    }

    public function getUserRewardInfo(User $user): array
    {
        $canClaim = $this->canClaimReward($user);

        return [
            'can_claim' => $canClaim,
            'base_gems' => $this->calculateBaseGems($user),
            'final_gems' => $this->calculateFinalGems($user),
            'has_subscription' => $user->hasActiveSubscription(),
            'last_claimed' => $user->userInfo->last_reward_claimed_at,
            'streak_count' => $user->userInfo->reward_streak_count,
            'total_gems' => $user->userInfo->gems,
            'months_active' => $user->userInfo->reward_program_started_at
                ? $user->userInfo->reward_program_started_at->diffInMonths(now())
                : 0,
            'next_claim_time' => $canClaim ? null : $user->userInfo->last_reward_claimed_at->addDay()->startOfDay(),
            'subscription_multiplier' => 1.5
        ];
    }
}
