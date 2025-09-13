<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $casts = ['expires_at', 'completed_at'];

    protected $fillable = [
        'contract_value',
        'mins_updated',
        'hour_updated',
        'hours_updated',
        'half_updated',
        'day_updated',
        'days_updated'
    ];

    public function type()
    {
        return $this->belongsTo(ContractType::class);
    }

    public function depAirport()
    {
        return $this->belongsTo(Airport::class, 'dep_airport_id', 'identifier');
    }

    public function arrAirport()
    {
        return $this->belongsTo(Airport::class, 'arr_airport_id', 'identifier');
    }

    public function currentAirport()
    {
        return $this->belongsTo(Airport::class, 'current_airport_id', 'identifier');
    }

    public function aircraft()
    {
        return $this->belongsTo(Aircraft::class);
    }

    public function communityJobContract()
    {
        return $this->belongsTo(CommunityJobContract::class);
    }

}
