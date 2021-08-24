<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pirep extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }

    public function aircraft()
    {
        return $this->belongsTo(Aircraft::class);
    }
}
