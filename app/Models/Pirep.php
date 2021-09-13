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

    public function pilot()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function aircraft()
    {
        return $this->belongsTo(Aircraft::class);
    }

    public function logs()
    {
        return $this->hasMany(FlightLog::class);
    }
}
