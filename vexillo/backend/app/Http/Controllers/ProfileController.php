<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'country' => $user->country,
            'email' => $user->email,
            'bestScore' => $user->bestScores()->max('score') ?? 0,
            'savedCountries' => $user->savedCountries()->select('id', 'country_code')->get(),
        ]);
    }
}