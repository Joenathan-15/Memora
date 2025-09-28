<?php

namespace App\Http\Controllers;

use App\Models\Deck;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class DeckController extends Controller
{
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
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title'       => 'required|string|max:255',
                'description' => 'nullable|string',
                'is_public'   => 'required|boolean',
                'ai_file' => 'nullable|file|max:10240|mimes:pdf,ppt,pptx,odp,png,jpg,jpeg',
            ]);

            $attributes = [
                'title'       => $validated['title'] ?? 'Untitled Deck',
                'description' => $validated['description'] ?? '',
                'is_public'   => $validated['is_public'],
                'user_id'     => $request->user()->id,
            ];

            if ($request->hasFile('ai_file')) {
                $path = $request->file('ai_file')->store('decks/ai_uploads', 'public');
                $attributes['ai_file_path'] = $path;

                // trigger AI processing service/job here
                // e.g., dispatch(new ProcessDeckAI($path, $request->user()->id));
            }

            $deck = Deck::create($attributes);

            return redirect()->route('home')
                ->with('success', 'Deck created successfully!');
        } catch (Throwable $e) {
        report($e);

        return back()->withErrors(['error' => 'Failed to create deck. Please try again.']);
    }
}

    /**
     * Display the specified resource.
     */
    public function show(Deck $deck)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Deck $deck)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Deck $deck)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Deck $deck)
    {
        //
    }
}
