<?php

namespace App\Http\Controllers;

use App\Models\SavedCountry;
use Illuminate\Http\Request;

class SavedCountryController extends Controller
{
    public function index(Request $request)
    {
        $savedCountries = $request->user()->savedCountries()->select('id', 'country_code')->get();

        return response()->json(['savedCountries' => $savedCountries]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'country_code' => 'required|string|max:10',
        ]);

        $savedCountry = new SavedCountry([
            'user_id' => $request->user()->id,
            'country_code' => $validated['country_code'],
        ]);
        $savedCountry->save();

        return response()->json([
            'message' => 'Negara tersimpan.',
            'savedCountry' => [
                'id' => $savedCountry->id,
                'country_code' => $savedCountry->country_code,
            ],
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $savedCountry = SavedCountry::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$savedCountry) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $savedCountry->delete();

        return response()->json(['message' => 'Negara dihapus dari tersimpan.']);
    }
}