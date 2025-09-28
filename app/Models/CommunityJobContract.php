<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityJobContract extends Model
{
    use HasFactory;

    protected $casts = [
        'is_completed' => 'boolean',
        'is_recurring' => 'boolean'
    ];
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function communityJob()
    {
        return $this->belongsTo(CommunityJob::class);
    }

    public function departureAirport()
    {
        return $this->belongsTo(Airport::class, 'dep_airport_id');
    }

    public function arrivalAirport()
    {
        return $this->belongsTo(Airport::class, 'arr_airport_id');
    }

}
