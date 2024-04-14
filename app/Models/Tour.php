<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
    use HasFactory;

    public function checkpoints()
    {
        return $this->hasMany(TourCheckpoint::class);
    }

    public function aircraft()
    {
        return $this->hasMany(TourAircraft::class);
    }

    public function participants()
    {
        return $this->hasMany(TourUser::class);
    }

    public function participantProgress()
    {
        return $this->hasMany(TourCheckpointUser::class, 'tour_id', 'id');
    }

    public function startingAirport()
    {
        return $this->belongsTo(Airport::class, 'start_airport_id', 'identifier');
    }
}
