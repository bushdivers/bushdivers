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
        'owner_id'
    ];

    protected $casts = [
        'last_inspected_at' => 'datetime'
    ];

    public function fleet()
    {
        return $this->belongsTo(Fleet::class);
    }

    public function location()
    {
        return $this->belongsTo(Airport::class, 'current_airport_id', 'identifier');
    }

    public function hub()
    {
        return $this->belongsTo(Airport::class, 'hub_id', 'identifier');
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

    public function getMaintenanceStatusAttribute()
    {
        $oneYearAgo = Carbon::now()->subYear();
        $status = false;
        if ($this->last_inspected_at && $this->last_inspected_at->lessThan($oneYearAgo)) {
            $status = true;
        }
        // check tbo and 100hr
        foreach ($this->engines as $engine) {
            if ($engine->mins_since_tbo >= $this->fleet->tbo_mins) {
                $status = true;
            }
            if ($engine->mins_since_100hr >= (100 * 60)) {
                $status = true;
            }
        }

        if ($this->is_rental) {
            $status = false;
        }

        return $status;
    }

    public function getTotalConditionAttribute()
    {
        $engines = AircraftEngine::where('aircraft_id', $this->id)->get();
        $numEngines = $engines->count();
        $totalEngineWear = $engines->sum('wear');
        $total = $this->wear + $totalEngineWear;
        return round($total / ($numEngines + 1));
    }
}
