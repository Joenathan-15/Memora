<?php

namespace App\Http\Controllers;

use App\Services\DailyRewardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailyRewardController extends Controller
{
    public function __construct(
        private DailyRewardService $rewardService
    ) {}

    public function claim(Request $request)
    {
        $user = $request->user();

        if (!$user->userInfo) {
            return back()->with('error', 'User info not found.');
        }

        $result = $this->rewardService->claimDailyReward($user);

        if ($result['success']) {
            return back()->with([
                'success' => $result['message'],
                'claimed_gems' => $result['gems_awarded'],
                'total_gems' => $result['total_gems']
            ]);
        }

        return back()->with('error', $result['message']);
    }

    public function show()
    {
        $user = auth()->user();

        return Inertia::render('rewards/index', [
            'rewardInfo' => $this->rewardService->getUserRewardInfo($user)
        ]);
    }
}
