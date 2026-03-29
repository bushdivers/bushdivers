<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

    public function fleet()
    {
        return $this->belongsTo(Fleet::class);
    }

    public function lastVariant()
    {
        return $this->belongsTo(FleetVariant::class, 'fleet_variant_id');
    }

    public function location()
    {
        return $this->belongsTo(Airport::class, 'current_airport_id');
    }

    public function hub()
    {
        return $this->belongsTo(Airport::class, 'rental_airport_id');
    }
}
