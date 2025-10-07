<?php

namespace App\Policies;

use App\Models\Deck;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DeckPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Deck $deck): bool
    {
        return $deck->isAccessibleBy($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Deck $deck): bool
    {
        return $deck->isOwnedBy($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Deck $deck): bool
    {
        return $deck->isOwnedBy($user);
    }

    /**
     * Determine whether the user can manage collaborators.
     */
    public function manageCollaborators(User $user, Deck $deck): bool
    {
        return $deck->isOwnedBy($user);
    }

    /**
     * Determine whether the user can create flashcards.
     */
    public function createFlashcard(User $user, Deck $deck): bool
    {
        return $deck->isAccessibleBy($user);
    }

    /**
     * Determine whether the user can update flashcards.
     */
    public function updateFlashcard(User $user, Deck $deck): bool
    {
        return $deck->isAccessibleBy($user);
    }

    /**
     * Determine whether the user can delete flashcards.
     */
    public function deleteFlashcard(User $user, Deck $deck): bool
    {
        return $deck->isAccessibleBy($user);
    }
}
