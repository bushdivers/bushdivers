<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    use HasFactory;

    public $incrementing = false;

    public function depAirport()
    {
        return $this->belongsTo(Airport::class, 'dep_airport_id', 'identifier');
    }

    public function arrAirport()
    {
        return $this->belongsTo(Airport::class, 'arr_airport_id', 'identifier');
    }
}
