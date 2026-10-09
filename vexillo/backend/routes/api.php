<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BestScoreController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SavedCountryController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (gunakan auth:sanctum, bukan auth)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [ProfileController::class, 'show']);

    Route::get('/best-score', [BestScoreController::class, 'show']);
    Route::post('/best-score', [BestScoreController::class, 'store']);

    Route::get('/saved-countries', [SavedCountryController::class, 'index']);
    Route::post('/saved-countries', [SavedCountryController::class, 'store']);
    Route::delete('/saved-countries/{id}', [SavedCountryController::class, 'destroy']);
});