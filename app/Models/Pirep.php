<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pirep extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    public function pilot()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function aircraft()
    {
        return $this->belongsTo(Aircraft::class);
    }

    public function rental()
    {
        return $this->belongsTo(Rental::class, 'aircraft_id', 'id');
    }

    public function logs()
    {
        return $this->hasMany(FlightLog::class);
    }

    public function depAirport()
    {
        return $this->belongsTo(Airport::class, 'departure_airport_id', 'identifier');
    }

    public function arrAirport()
    {
        return $this->belongsTo(Airport::class, 'destination_airport_id', 'identifier');
    }
}
