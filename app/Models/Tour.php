<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tour extends Model
{
    /**
     * @use HasFactory<\Database\Factories\TourFactory>
     */
    use HasFactory;

    /**
     * @return HasMany<TourCheckpoint, $this>
     */
    public function checkpoints(): HasMany
    {
        return $this->hasMany(TourCheckpoint::class);
    }

    /**
     * @return HasMany<TourAircraft, $this>
     */
    public function aircraft(): HasMany
    {
        return $this->hasMany(TourAircraft::class);
    }

    /**
     * @return HasMany<TourUser, $this>
     */
    public function participants(): HasMany
    {
        return $this->hasMany(TourUser::class);
    }

    /**
     * @return HasMany<TourCheckpointUser, $this>
     */
    public function participantProgress(): HasMany
    {
        return $this->hasMany(TourCheckpointUser::class, 'tour_id', 'id');
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function startingAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'start_airport_id');
    }
}
