<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractCargo extends Model
{
    use HasFactory;

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function currentAirport()
    {
        return $this->belongsTo(Airport::class, 'current_airport_id', 'identifier');
    }

    public function pirepCargo()
    {
        return $this->hasOne(PirepCargo::class, 'contract_cargo_id', 'id');
    }
}
