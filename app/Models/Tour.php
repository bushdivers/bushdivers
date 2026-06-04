<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tour extends Model
{
    use HasFactory;

    public function checkpoints(): HasMany
    {
        return $this->hasMany(TourCheckpoint::class);
    }

    public function aircraft(): HasMany
    {
        return $this->hasMany(TourAircraft::class);
    }

    public function participants(): HasMany
    {
        return $this->hasMany(TourUser::class);
    }

    public function participantProgress(): HasMany
    {
        return $this->hasMany(TourCheckpointUser::class, 'tour_id', 'id');
    }

    public function startingAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'start_airport_id');
    }
}
