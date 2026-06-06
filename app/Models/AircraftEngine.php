<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AircraftEngine extends Model
{
    use HasFactory;

    protected $fillable = [
        'aircraft_id',
        'engine_number',
        'wear',
        'mins_since_tbo',
        'mins_since_100hr',
    ];

    /**
     * @return BelongsTo<Aircraft, $this>
     */
    public function aircraft(): BelongsTo
    {
        return $this->belongsTo(Aircraft::class);
    }

    public function wear(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => max(0, min(100, $value)),
        );
    }
}
