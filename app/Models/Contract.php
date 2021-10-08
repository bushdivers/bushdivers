<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    public function cargo()
    {
        return $this->hasMany(ContractCargo::class);
    }

    public function depAirport()
    {
        return $this->belongsTo(Airport::class, 'dep_airport_id', 'identifier');
    }

    public function arrAirport()
    {
        return $this->belongsTo(Airport::class, 'arr_airport_id', 'identifier');
    }
}
