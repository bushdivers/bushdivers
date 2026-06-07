<?php

namespace App\Models;

use App\Contracts\IsLocatable;
use App\Models\Enums\FuelType;
use App\Models\Enums\SimType;
use App\Models\Concerns\HasLocation;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Location\Coordinate;
use Override;

class Airport extends Model implements IsLocatable
{
    use HasFactory;
    use HasLocation;

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

    #[Override]
    protected function casts(): array
    {
        return [
            'has_avgas' => 'boolean',
            'has_jetfuel' => 'boolean',
            'is_hub' => 'boolean',
            'is_thirdparty' => 'boolean',
            'sim_type' => AsEnumCollection::of(SimType::class),
        ];
    }

    protected static function booted(): void
    {

    }

    /**
     * @return HasMany<Contract, $this>
     */
    public function hubContracts(): HasMany
    {
        return $this->hasMany(Contract::class, 'hub_airport_id');
    }

    /**
     * @return HasMany<Aircraft, $this>
     */
    public function ferryFlights(): HasMany
    {
        return $this->hasMany(Aircraft::class, 'hub_id');
    }

    #[Scope]
    protected function withRangeTo(Builder $query, Airport|Coordinate|null $to)
    {
        if (!$to) {
            return $query;
        }

        // Distances in NM

        // Duplicating the calc fields keeps it as simple select without subqueries, etc
        $lat = $to instanceof Coordinate ? $to->getLat() : $to->lat;
        $lon = $to instanceof Coordinate ? $to->getLng() : $to->lon;

        return $query
            ->selectRaw('airports.*,
             3440 * ACOS(
                COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) +
                 SIN(RADIANS(?)) * SIN(RADIANS(lat))) as distance', [$lat, $lon, $lat]);
    }

    /**
     * @param Builder<Airport>  $query
     */
    #[Scope]
    protected function inRangeOf(Builder $query, Airport|Coordinate $from, $min, $max)
    {
        $max = max($min, $max - 0.001);

        // Duplicating the calc fields keeps it as simple select without subqueries, etc
        $lat = $from instanceof Coordinate ? $from->getLat() : $from->lat;
        $lon = $from instanceof Coordinate ? $from->getLng() : $from->lon;

        // Approximate bounding box to reduce
        $latRange = $max / 60; // 1 degree latitude is ~60 NM, so convert to degrees for lat range

        $query->withRangeTo($from)
            ->whereBetween('lat', [$lat - $latRange, $lat + $latRange])
            ->when(abs($lat) < 85, function ($q) use ($lon, $lat, $max) {
                $lonRange = abs($max / (60 * cos(deg2rad($lat)))); // adjust longitude range based on latitude
                $q->whereBetween('lon', [$lon - $lonRange, $lon + $lonRange]);
            })
            ->whereRaw('3440 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(?) - RADIANS(lon)) + SIN(RADIANS(?)) * SIN(RADIANS(lat))) between ? AND ?', [$lat, $lon, $lat, $min, $max]);
    }

    #[Scope]
    protected function hub(Builder $query)
    {
        $query->where('is_hub', true)->where('hub_in_progress', false);
    }

    #[Scope]
    protected function fuel(Builder $query)
    {
        $query->where('has_avgas', true)->orWhere('has_jetfuel', true);
    }

    #[Scope]
    protected function thirdParty(Builder $query)
    {
        $query->where('is_thirdparty', true);
    }

    #[Scope]
    protected function forUser(Builder $query, User $user)
    {
        // If we're not allowing third party airports
        if (!$user->allow_thirdparty_airport) {
            // If we're also not allowing third party hubs
            if (!$user->allow_thirdparty_hub) {
                $query->where('is_thirdparty', false);
            } else { // we are allowing third party hubs
                $query->where(function ($q) {
                    // Need to filter out third party but not hubs
                    $q->where('is_thirdparty', false)->orWhere('is_hub', true);
                });
            }
        }
        //otherwise, we're allowing all third party (incl hubs) airports, so no filter needed

        $query->where(function ($q) use ($user) {
            $q->whereNull('user_id')->orWhere('user_id', $user->id);
        });
    }

    /**
     * Scope a query to only include base airports (not third party, no user).
     * If user provided, optionally enable hub based on user settings.
     */
    #[Scope]
    protected function base(Builder $query, User|null $user = null)
    {
        $query->whereNull('user_id');

        $query->where(function ($q) use ($user) {
            $q->where('is_thirdparty', false);

            if ($user && $user->allow_thirdparty_hub) {
                $q->orWhere('is_hub', true);
            }
        });
    }

    /**
     * @return Attribute<int|null, int|null>
     */
    protected function avgasQty(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value === null ? null : max(0, $value)
        );
    }

    /**
     * @return Attribute<int|null, int|null>
     */
    protected function jetfuelQty(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value === null ? null : max(0, $value)
        );
    }

    public function getCoordinate(): Coordinate
    {
        return new Coordinate($this->lat, $this->lon);
    }

    /**
     * Adjust airport fuel reserves
     * @param int $type
     * @param int $quantity (positive to add, negative to remove)
     */
    public function adjustFuel(int $type, int $quantity)
    {
        if ($this->is_hub || $quantity == 0) return;

        /**
         * @todo FuelType enum
         */
        $column = match ($type) {
            FuelType::AVGAS => 'avgas_qty',
            FuelType::JET => 'jetfuel_qty',
            default => throw new \InvalidArgumentException('Invalid fuel type'),
        };

        $this->{$column} += $quantity;
        $this->save();
    }
}
