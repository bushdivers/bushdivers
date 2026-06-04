<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TourUser extends Model
{
    use HasFactory;

    protected $fillable = ['tour_id', 'user_id', 'next_airport_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tours(): HasMany
    {
        return $this->hasMany(Tour::class);
    }

    public function nextAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'next_airport_id');
    }
}
