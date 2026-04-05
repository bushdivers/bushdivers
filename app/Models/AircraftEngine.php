<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AircraftEngine extends Model
{
    use HasFactory;

    protected $fillable = [
        'aircraft_id',
        'engine_number',
        'wear',
        'mins_since_tbo',
        'mins_since_100hr',
    ];

    public function aircraft()
    {
        return $this->belongsTo(Aircraft::class);
    }

    public function setWearAttribute($value)
    {
        $this->attributes['wear'] = max(0, min(100, $value));
    }
}
