<?php

namespace App\Models;

use App\Models\Enums\PirepState;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pirep extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    public function scopeInactive(Builder $query)
    {
        return $query->where(function ($q) {
            $q->where('state', PirepState::DISPATCH)
                ->where('updated_at', '<', now()->subHours(8));
        })->orWhere(function ($q) {
            $q->where('state', PirepState::IN_PROGRESS)
                ->where('updated_at', '<', now()->subHours(2));
        });
    }

    public function pilot(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function aircraft(): BelongsTo
    {
        return $this->belongsTo(Aircraft::class);
    }

    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class, 'aircraft_id', 'id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(FlightLog::class);
    }

    public function latestLog(): HasOne
    {
        return $this->hasOne(FlightLog::class)->latestOfMany();
    }

    public function depAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'departure_airport_id', 'id');
    }

    public function arrAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'arrival_airport_id', 'id');
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(FleetVariant::class, 'fleet_variant_id');
    }


}
