<?php

namespace App\Http\Controllers;

use App\Models\AIHistoryUse;
use App\Models\Deck;
use App\Models\Flashcard;
use App\Services\FlashcardGeneratorService;
use Carbon\Carbon;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DeckController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('decks/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, FlashcardGeneratorService $flashcardGenerator)
    {
        try {
            $validated = $request->validate([
                'title'       => 'string|max:255|nullable',
                'description' => 'nullable|string',
                'is_public'   => 'required|boolean',
                'ai_file' => 'nullable|file|max:10240|mimes:pdf',
            ]);

            $attributes = [
                'title'       => $validated['title'] ?? 'Untitled Deck',
                'description' => $validated['description'] ?? '',
                'is_public'   => $validated['is_public'],
                'user_id'     => $request->user()->id,
            ];

            if ($request->hasFile('ai_file')) {
                $todays = AIHistoryUse::where('user_id', auth()->user()->id)->whereDate('created_at', Carbon::today())->get();
                if (count($todays) > 3 && !auth()->user()->hasActiveSubscription()) {
                    throw new Exception("You can only upload 3 files per day.");
                }

                $path = $request->file('ai_file')->store('decks/ai_uploads', 'public');
                $attributes['ai_file_path'] = $path;
                $items = $flashcardGenerator->generateFlashcardsFromPdf($request->file("ai_file"));
                $attributes["title"] = $items["title"];
                $attributes["description"] = $items["description"];
            }
            $deck = Deck::create($attributes);

            if (isset($items["flashcards"])) {
                foreach ($items["flashcards"] as $item) {
                    Flashcard::create([
                        'question' => $item["question"],
                        'answer' => $item["answer"],
                        'deck_id' => $deck["id"],
                        'is_ai_generated' => true
                    ]);
                }
            }

            if ($request->hasFile('ai_file')) {
                AIHistoryUse::create([
                    'user_id' => $request->user()->id,
                    'deck_id' => $deck->id,
                ]);
            }

            return redirect()->route('home')
                ->with('success', 'Deck created successfully!');
        } catch (Exception $e) {
            report($e);
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Deck $deck)
    {
        $userId = auth()->id();

        $allFlashcards = $deck->flashcards()
            ->with(['userReview' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }])
            ->get();

        $flashcardsWithStatus = $allFlashcards->map(function ($flashcard) use ($userId) {
            $review = $flashcard->userReview;

            if (!$review) {
                $review = $flashcard->getOrCreateUserReview($userId);
            }

            return [
                'id' => $flashcard->id,
                'question' => $flashcard->question,
                'answer' => $flashcard->answer,
                'is_due' => $review->isDue(),
                'next_review_date' => $review->next_review_date->format('Y-m-d'),
                'interval' => $review->interval,
                'repetition' => $review->repetition,
                'ease_factor' => $review->ease_factor,
                'last_reviewed_at' => $review->last_reviewed_at?->diffForHumans(),
                'review_count' => $review->review_count,
                'correct_count' => $review->correct_count,
                'accuracy' => $review->review_count > 0
                    ? round(($review->correct_count / $review->review_count) * 100)
                    : null,
                'is_ai_generated' => $flashcard->is_ai_generated,
            ];
        });

        $dueCards = $flashcardsWithStatus->filter(fn($card) => $card['is_due']);
        $futureCards = $flashcardsWithStatus->filter(fn($card) => !$card['is_due']);

        $stats = [
            'total_cards' => $allFlashcards->count(),
            'due_today' => $dueCards->count(),
            'learned' => $flashcardsWithStatus->filter(fn($card) => $card['repetition'] > 0)->count(),
            'new' => $flashcardsWithStatus->filter(fn($card) => $card['review_count'] == 0)->count(),
        ];

        return Inertia::render('decks/show', [
            'deck' => $deck,
            'dueCards' => $dueCards->values(),
            'futureCards' => $futureCards->values(),
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Deck $deck)
    {
        $this->authorize('view', $deck);

        return Inertia::render('decks/edit', [
            'deck' => $deck->load('flashcards', 'owner', 'collaborators'),
            'is_owner' => $deck->isOwnedBy(auth()->user()),
            'is_collaborator' => $deck->isCollaborator(auth()->user()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        try {
            $deck = Deck::findOrFail($id);
        } catch (\Exception $e) {
            return redirect()->route('home')
                ->with('error', 'Deck not found.');
        }

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public'   => 'required|boolean',
        ]);

        $deck->update($validated);

        return redirect()->route('home')
            ->with('success', 'Deck updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Deck $deck)
    {
        //
    }


    public function import(string $uuid)
    {
        $deck = Deck::where("uuid", $uuid)->first();
        $flashcards = Flashcard::where("deck_id", $deck->id)->get();

        try {
            DB::beginTransaction();
            $newDeck = Deck::create([
                'title'       => $deck->title ?? "",
                'description' => $deck->description ?? "",
                'is_public'   => false,
                'user_id'     => Auth()->user()->id,
            ]);
            foreach ($flashcards as $flashcard) {
                Flashcard::create([
                    'question' => $flashcard->question,
                    'answer' => $flashcard->answer,
                    'deck_id' => $newDeck->id,
                    'is_ai_generated' => $flashcard->is_ai_generated
                ]);
            }
            DB::commit();
            return redirect()->route("home")->with('success', "Deck Has Been Import");
        } catch (\Exception $err) {
            DB::rollback();
            return redirect()->route("home")->with('error', "fail to import Deck");
        }
    }

    /**
     * Review a flashcard
     */
    public function reviewCard(Deck $deck, $flashcardId)
    {
        $quality = request()->validate([
            'quality' => 'required|integer|min:0|max:5'
        ])['quality'];

        $flashcard = $deck->flashcards()->findOrFail($flashcardId);
        $review = $flashcard->getOrCreateUserReview();
        $review->updateReview($quality);

        //        return response()->json([
        //            'success' => true,
        //            'next_review_date' => $review->next_review_date->format('Y-m-d'),
        //            'interval' => $review->interval,
        //        ]);
        return redirect()->route('decks.show', $deck->uuid, 303);
    }
}
