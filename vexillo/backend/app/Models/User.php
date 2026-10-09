<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'country',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relasi ke best score (satu user bisa punya banyak best score, tapi kita ambil yang tertinggi)
    public function bestScores()
    {
        return $this->hasMany(BestScore::class);
    }

    // Relasi ke saved countries
    public function savedCountries()
    {
        return $this->hasMany(SavedCountry::class);
    }
}