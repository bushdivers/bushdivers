<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourCheckpoint extends Model
{
    /**
     * @use HasFactory<\Database\Factories\TourCheckpointFactory>
     */
    use HasFactory;

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function airport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'checkpoint_airport_id');
    }
}
