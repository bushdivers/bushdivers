<?php

namespace App\Models;

use App\Contracts\IsLocatable;
use App\Models\Concerns\HasLocation;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Location\Coordinate;

class Aircraft extends Model implements IsLocatable
{
    use HasFactory;
    use HasLocation;

    protected $appends = [
        'maintenance_status',
        'total_condition'
    ];

    protected $fillable = [
        'owner_id',
        'fleet_id',
        'current_airport_id',
        'wear'
    ];

    protected $casts = [
        'last_inspected_at' => 'datetime',
        'is_ferry' => 'boolean'
    ];

    public function fleet(): BelongsTo
    {
        return $this->belongsTo(Fleet::class);
    }

    public function lastVariant(): BelongsTo
    {
        return $this->belongsTo(FleetVariant::class, 'fleet_variant_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'current_airport_id');
    }

    public function hub(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'hub_id');
    }

    public function pireps(): HasMany
    {
        return $this->hasMany(Pirep::class, 'aircraft_id', 'id')->orderBy('submitted_at', 'desc');
    }

    public function engines(): HasMany
    {
        return $this->hasMany(AircraftEngine::class);
    }

    public function maintenance(): HasMany
    {
        return $this->hasMany(MaintenanceLog::class)->orderBy('created_at', 'desc');
    }

    public function setWearAttribute($value)
    {
        $this->attributes['wear'] = max(0, min(100, $value));
    }

    public function setFuelOnboardAttribute($value)
    {
        $this->attributes['fuel_onboard'] = max(0, $value);
    }

    public function getMaintenanceStatusAttribute()
    {
        $oneYearAgo = Carbon::now()->subYear();
        if ($this->last_inspected_at && $this->last_inspected_at->lessThan($oneYearAgo)) {
            return true;
        }

        // check tbo and 100hr
        foreach ($this->engines as $engine) {
            if ($engine->mins_since_tbo >= $this->fleet->tbo_mins) {
                return true;
            }
            if ($engine->mins_since_100hr >= (100 * 60)) {
                return true;
            }
        }

        return false;
    }

    public function getTotalConditionAttribute()
    {
        $numEngines = $this->engines->count();
        $totalEngineWear = $this->engines->sum('wear');
        $total = $this->wear + $totalEngineWear;
        return round($total / ($numEngines + 1));
    }

    public function getCoordinate(): Coordinate
    {
        return new Coordinate($this->last_lat, $this->last_lon);
    }
}
