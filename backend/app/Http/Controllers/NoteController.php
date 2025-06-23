<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        // Get all notes from the current tenant (not just user's notes)
        $notes = Note::with('user') // Include user info if needed
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $note = $request->user()->notes()->create([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($note, 201);
    }

    public function show(Request $request, Note $note)
    {
        // Ensure the note belongs to the authenticated user
        if ($note->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($note);
    }

    public function update(Request $request, Note $note)
    {
        // Ensure the note belongs to the authenticated user
        if ($note->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $note->update([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json($note);
    }

    public function destroy(Request $request, Note $note)
    {
        // Ensure the note belongs to the authenticated user
        if ($note->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully']);
    }
}