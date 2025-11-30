<?php

namespace App\Models;

use App\Models\Enums\AircraftType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Fleet extends Model
{
    use HasFactory;

    protected $casts = [
        'aircraft_type' => AircraftType::class,
        'has_floats' => 'boolean',
    ];

    public function aircraft()
    {
        return $this->hasMany(Aircraft::class, 'fleet_id', 'id');
    }

    public function manufacturer()
    {
        return $this->belongsTo(Manufacturer::class);
    }

    public function uploads(): MorphMany
    {
        return $this->morphMany(Upload::class, 'uploadable');
    }
}
