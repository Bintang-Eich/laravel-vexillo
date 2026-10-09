<?php

namespace App\Http\Controllers;

use App\Models\BestScore;
use Illuminate\Http\Request;

class BestScoreController extends Controller
{
    // GET /api/best-score
    public function show(Request $request)
    {
        $bestScore = $request->user()->bestScores()->max('score') ?? 0;

        return response()->json(['bestScore' => $bestScore]);
    }

    // POST /api/best-score
    public function store(Request $request)
    {
        $validated = $request->validate([
            'score' => 'required|integer|min:0',
        ]);

        $user = $request->user();
        $currentBest = $user->bestScores()->max('score') ?? 0;

        if ($validated['score'] > $currentBest) {
            $bestScore = new BestScore([
                'user_id' => $user->id,
                'score' => $validated['score'],
            ]);
            $bestScore->save();

            return response()->json([
                'message' => 'Best score baru disimpan.',
                'bestScore' => $validated['score'],
            ], 201);
        }

        return response()->json([
            'message' => 'Skor tidak lebih tinggi dari best score saat ini.',
            'bestScore' => $currentBest,
        ]);
    }
}