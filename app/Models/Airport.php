<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Location\Coordinate;

class Airport extends Model
{
    use HasFactory;

    protected $fillable = [
        'identifier',
        'name',
        'location',
        'country',
        'country_code',
        'flag',
        'lat',
        'lon',
        'magnetic_variance',
        'altitude',
        'size',
        'longest_runway_length',
        'longest_runway_width',
        'longest_runway_surface',
        'has_avgas',
        'has_jetfuel',
        'is_thirdparty',
    ];

    protected $hidden = [
        'point'
    ];

    protected $casts = [
        'has_avgas' => 'boolean',
        'has_jetfuel' => 'boolean',
        'is_hub' => 'boolean',
        'is_thirdparty' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('baseOnly', function (Builder $builder) {
            $builder->where('is_thirdparty', false)
                    ->whereNull('user_id');
        });
    }

    public function hubContracts()
    {
        return $this->hasMany(Contract::class, 'airport', 'identifier');
    }

    public function ferryFlights()
    {
        return $this->hasMany(Aircraft::class, 'hub_id', 'identifier');
    }

    public function scopeWithRangeTo(Builder $query, Airport|Coordinate $to)
    {
        // Distances in NM

        // Duplicating the calc fields keeps it as simple select without subqueries, etc
        $lat = $to instanceof Coordinate ? $to->getLat() : $to->lat;
        $lon = $to instanceof Coordinate ? $to->getLng() : $to->lon;

        return $query
            ->selectRaw('airports.*, 3440 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) + SIN(RADIANS(?)) * SIN(RADIANS(lat))) as distance', [$lat, $lon, $lat]);
    }

    public function scopeInRangeOf(Builder $query, Airport|Coordinate $from, $min, $max)
    {
        // Distances in NM

        // Duplicating the calc fields keeps it as simple select without subqueries, etc
        $lat = $from instanceof Coordinate ? $from->getLat() : $from->lat;
        $lon = $from instanceof Coordinate ? $from->getLng() : $from->lon;

        $query->withRangeTo($from)
            //->selectRaw('airports.*, 3440 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) + SIN(RADIANS(?)) * SIN(RADIANS(lat))) as distance', [$lat, $lon, $lat])
            ->whereRaw('FLOOR(3440 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) + SIN(RADIANS(?)) * SIN(RADIANS(lat)))) between ? AND (? - 0.001)', [$lat, $lon, $lat, $min, $max]);
    }

    public function scopeHub(Builder $query)
    {
        $query->where('is_hub', true);
    }

    public function scopeFuel(Builder $query)
    {
        $query->where('has_avgas', true)->orWhere('has_jetfuel', true);
    }

    public function scopeThirdParty(Builder $query)
    {
        $query->withoutGlobalScope('baseOnly')->where('is_thirdparty', true);
    }


}

