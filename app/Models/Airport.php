<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Location\Coordinate;

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

    public function scopeInRangeOf(Builder $query, Airport|Coordinate $from, $min, $max)
    {
        // Distances in NM

        // Duplicating the calc fields keeps it as simple select without subqueries, etc
        $lat = $from instanceof Coordinate ? $from->getLat() : $from->lat;
        $lon = $from instanceof Coordinate ? $from->getLng() : $from->lon;

        $query
            ->selectRaw('airports.*, 3440 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) + SIN(RADIANS(?)) * SIN(RADIANS(lat))) as distance', [$lat, $lon, $lat])
            ->whereRaw('3440 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) + SIN(RADIANS(?)) * SIN(RADIANS(lat))) between ? AND ?', [$lat, $lon, $lat, $min, $max]);
    }

    public function scopeHub(Builder $query)
    {
        $query->where('is_hub', true);
    }

    public function scopeFuel(Builder $query)
    {
        $query->where('has_avgas', true)->orWhere('has_jetfuel', true);
    }

    public function scopeMinSize(Builder $query, int $minSize)
    {
        $query->where('size', '>=', $minSize);
    }


}

