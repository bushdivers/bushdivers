<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aircraft extends Model
{
    use HasFactory;

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

    public function fleet()
    {
        return $this->belongsTo(Fleet::class);
    }

    public function lastVariant()
    {
        return $this->belongsTo(FleetVariant::class, 'fleet_variant_id');
    }

    public function location()
    {
        return $this->belongsTo(Airport::class, 'current_airport_id');
    }

    public function hub()
    {
        return $this->belongsTo(Airport::class, 'hub_id');
    }

    public function pireps()
    {
        return $this->hasMany(Pirep::class, 'aircraft_id', 'id')->orderBy('submitted_at', 'desc');
    }

    public function engines()
    {
        return $this->hasMany(AircraftEngine::class);
    }

    public function maintenance()
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
}
