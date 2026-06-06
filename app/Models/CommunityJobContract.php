<?php

namespace App\Models;

use App\Models\Enums\CargoType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommunityJobContract extends Model
{
    use HasFactory;

    protected $casts = [
        'is_completed' => 'boolean',
        'is_recurring' => 'boolean',
        'cargo_type' => CargoType::class
    ];

    /**
     * @return HasMany<Contract, $this>
     */
    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    /**
     * @return BelongsTo<CommunityJob, $this>
     */
    public function communityJob(): BelongsTo
    {
        return $this->belongsTo(CommunityJob::class);
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function departureAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'dep_airport_id');
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function arrivalAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'arr_airport_id');
    }

    public function setRemainingPayloadAttribute($value)
    {
        $this->attributes['remaining_payload'] = max($value, 0);
    }

}
