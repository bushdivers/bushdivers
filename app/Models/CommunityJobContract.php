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

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function communityJob(): BelongsTo
    {
        return $this->belongsTo(CommunityJob::class);
    }

    public function departureAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'dep_airport_id');
    }

    public function arrivalAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'arr_airport_id');
    }

    public function setRemainingPayloadAttribute($value)
    {
        $this->attributes['remaining_payload'] = max($value, 0);
    }

}
