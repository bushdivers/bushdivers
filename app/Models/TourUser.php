<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TourUser extends Model
{
    /**
     * @use HasFactory<\Database\Factories\TourUserFactory>
     */
    use HasFactory;

    protected $fillable = ['tour_id', 'user_id', 'next_airport_id'];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<Tour, $this>
     */
    public function tours(): HasMany
    {
        return $this->hasMany(Tour::class);
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function nextAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'next_airport_id');
    }
}
