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

    /**
     * @return HasMany<Aircraft, $this>
     */
    public function aircraft(): HasMany
    {
        return $this->hasMany(Aircraft::class, 'fleet_id', 'id');
    }

    /**
     * @return BelongsTo<Manufacturer, $this>
     */
    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function hq(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'hq_airport_id');
    }

    /**
     * @return MorphMany<Upload, $this>
     */
    public function uploads(): MorphMany
    {
        return $this->morphMany(Upload::class, 'uploadable');
    }

    /**
     * @return HasMany<FleetVariant, $this>
     */
    public function variants(): HasMany
    {
        return $this->hasMany(FleetVariant::class);
    }

    /**
     * @return HasOne<FleetVariant, $this>
     */
    public function defaultVariant(): HasOne
    {
        return $this->hasOne(FleetVariant::class)->where('is_default', true);
    }
}
