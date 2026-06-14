<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourAircraft extends Model
{
    /**
     * @use HasFactory<\Database\Factories\TourAircraftFactory>
     */
    use HasFactory;

    /**
     * @return BelongsTo<Fleet, $this>
     */
    public function fleet(): BelongsTo
    {
        return $this->belongsTo(Fleet::class);
    }
}
