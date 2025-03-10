<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Airport extends Model
{
    use HasFactory;

    protected $hidden = [
        'point'
    ];

    public function hubContracts()
    {
        return $this->hasMany(Contract::class, 'airport', 'identifier');
    }

    public function ferryFlights()
    {
        return $this->hasMany(Aircraft::class, 'hub_id', 'identifier');
    }

    public function scopeInRangeOf(Builder $query, Airport $from, $min, $max): Builder
    {
        // Duplicating the calc fields keeps it as simple select without subqueries, etc
        return $query
            ->selectRaw('airports.*, 3956 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) + SIN(RADIANS(?)) * SIN(RADIANS(lat))) as distance', [$from->lat, $from->lon, $from->lat])
            ->whereRaw('3956 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) + SIN(RADIANS(?)) * SIN(RADIANS(lat))) between ? AND ?', [$from->lat, $from->lon, $from->lat, $min, $max]);
    }

    public function scopeHub(Builder $query): Builder
    {
        return $query->where('is_hub', true);
    }

    public function scopeFuel(Builder $query): Builder
    {
        return $query->where('has_avgas', true)->orWhere('has_jetfuel', true);
    }


}

