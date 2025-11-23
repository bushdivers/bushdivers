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

    }

    public function hubContracts()
    {
        return $this->hasMany(Contract::class, 'hub_airport_id');
    }

    public function ferryFlights()
    {
        return $this->hasMany(Aircraft::class, 'hub_id');
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
        $max = max($min, $max - 0.001);

        // Duplicating the calc fields keeps it as simple select without subqueries, etc
        $lat = $from instanceof Coordinate ? $from->getLat() : $from->lat;
        $lon = $from instanceof Coordinate ? $from->getLng() : $from->lon;

        $query->withRangeTo($from)
            //->selectRaw('airports.*, 3440 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) + SIN(RADIANS(?)) * SIN(RADIANS(lat))) as distance', [$lat, $lon, $lat])
            ->whereRaw('FLOOR(3440 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) + SIN(RADIANS(?)) * SIN(RADIANS(lat)))) between ? AND ?', [$lat, $lon, $lat, $min, $max]);
    }

    public function scopeHub(Builder $query)
    {
        $query->where('is_hub', true)->where('hub_in_progress', false);
    }

    public function scopeFuel(Builder $query)
    {
        $query->where('has_avgas', true)->orWhere('has_jetfuel', true);
    }

    public function scopeThirdParty(Builder $query)
    {
        $query->where('is_thirdparty', true);
    }

    public function scopeForUser(Builder $query, User $user)
    {
        // If we're not allowing third party airports
        if (!$user->allow_thirdparty_airport)
        {
            // If we're also not allowing third party hubs
            if (!$user->allow_thirdparty_hub)
                $query->where('is_thirdparty', false);
            else // we are allowing third party hubs
                $query->where(function($q) {
                    // Need to filter out third party but not hubs
                    $q->where('is_thirdparty', false)->orWhere('is_hub', true);
                });
        }
        //otherwise, we're allowing all third party (incl hubs) airports, so no filter needed

        $query->where(function($q) use ($user) {
            $q->whereNull('user_id')->orWhere('user_id', $user->id);
        });
    }

    /**
     * Scope a query to only include base airports (not third party, no user).
     * If user provided, optionally enable hub based on user settings.
     */
    public function scopeBase(Builder $query, User|null $user = null)
    {
        $query->whereNull('user_id');

        $query->where(function ($q) use ($user) {
            $q->where('is_thirdparty', false);

            if ($user && $user->allow_thirdparty_hub) {
                $q->orWhere('is_hub', true);
            }
        });
    }

}

