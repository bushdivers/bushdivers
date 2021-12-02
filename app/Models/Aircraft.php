<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aircraft extends Model
{
    use HasFactory;

    protected $appends = [
        'maintenance_status'
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

    public function getMaintenanceStatusAttribute()
    {
        $status = false;
        // check 100 hr
        if ($this->mins_since_100hr >= (100 * 60)) {
            $status = true;
        }
        // check tbo
        foreach ($this->engines as $engine) {
            if ($engine->mins_since_tbo >= $this->fleet->tbo_mins) {
                $status = true;
            }
        }

        return $status;
    }
}
