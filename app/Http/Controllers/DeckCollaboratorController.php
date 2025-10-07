<?php

namespace App\Http\Controllers;

use App\Models\Deck;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DeckCollaboratorController extends Controller
{
    use AuthorizesRequests;

    /**
     * Add a collaborator to a deck by email.
     */
    public function store(Request $request, Deck $deck): RedirectResponse
    {
        $this->authorize('manageCollaborators', $deck);

        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $collaborator = User::where('email', $request->email)->firstOrFail();

        if ($deck->user_id == $collaborator->id) {
            return back()->withErrors([
                'email' => 'Cannot add deck owner as collaborator'
            ]);
        }

        if ($deck->collaborators()->where('user_id', $collaborator->id)->exists()) {
            return back()->withErrors([
                'email' => 'User is already a collaborator'
            ]);
        }

        $deck->collaborators()->attach($collaborator->id);

        return redirect()->back()->with('success', 'Collaborator added successfully');
    }

    /**
     * Remove a collaborator from a deck.
     */
    public function destroy(Deck $deck, User $user): RedirectResponse
    {
        $this->authorize('manageCollaborators', $deck);

        $deck->collaborators()->detach($user->id);

        return redirect()->back()->with('success', 'Collaborator removed successfully');
    }

    /**
     * List all collaborators for a deck.
     */
    public function index(Deck $deck): Response
    {
        $this->authorize('view', $deck);

        $collaborators = $deck->collaborators()->get();

        return Inertia::render('DeckCollaborators/Index', [
            'deck' => $deck,
            'collaborators' => $collaborators
        ]);
    }

    /**
     * Search users by email for adding collaborators.
     */
    public function search(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'email' => 'required|string|min:2'
        ]);

        $users = User::where('email', 'like', $request->email . '%')
            ->select('id', 'name', 'email')
            ->limit(10)
            ->get();

        return response()->json([
            'users' => $users
        ]);
    }
}
