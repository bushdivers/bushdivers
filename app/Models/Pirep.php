<?php

namespace App\Models;

use App\Models\Enums\PirepState;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function pilot()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function aircraft()
    {
        return $this->belongsTo(Aircraft::class);
    }

    public function rental()
    {
        return $this->belongsTo(Rental::class, 'aircraft_id', 'id');
    }

    public function logs()
    {
        return $this->hasMany(FlightLog::class);
    }

    public function latestLog()
    {
        return $this->hasOne(FlightLog::class)->latestOfMany();
    }

    public function depAirport()
    {
        return $this->belongsTo(Airport::class, 'departure_airport_id', 'id');
    }

    public function arrAirport()
    {
        return $this->belongsTo(Airport::class, 'arrival_airport_id', 'id');
    }

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }

    public function variant()
    {
        return $this->belongsTo(FleetVariant::class, 'fleet_variant_id');
    }


}
