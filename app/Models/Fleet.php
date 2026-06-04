<?php

namespace App\Models;

use App\Models\Enums\AircraftType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Fleet extends Model
{
    use HasFactory;

    protected $casts = [
        'aircraft_type' => AircraftType::class,
        'has_floats' => 'boolean',
    ];

    public function aircraft(): HasMany
    {
        return $this->hasMany(Aircraft::class, 'fleet_id', 'id');
    }

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
    }

    public function hq(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'hq_airport_id');
    }

    public function uploads(): MorphMany
    {
        return $this->morphMany(Upload::class, 'uploadable');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(FleetVariant::class);
    }

    public function defaultVariant(): HasOne
    {
        return $this->hasOne(FleetVariant::class)->where('is_default', true);
    }
}
