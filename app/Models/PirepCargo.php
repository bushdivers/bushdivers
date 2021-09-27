<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PirepCargo extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function pirep()
    {
        return $this->belongsTo(Pirep::class);
    }

    public function cargo()
    {
        return $this->hasMany(ContractCargo::class);
    }
}
