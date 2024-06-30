<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Airport extends Model
{
    use HasFactory;

    protected $hidden = [
        'point'
    ];

    public function hubContracts()
    {
        return $this->hasMany(Contract::class, 'airport', 'identifier');
    }

    public function ferryFlights()
    {
        return $this->hasMany(Aircraft::class, 'hub_id', 'identifier');
    }
}
