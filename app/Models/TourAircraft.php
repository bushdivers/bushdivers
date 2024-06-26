<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourAircraft extends Model
{
    use HasFactory;

    public function fleet()
    {
        return $this->belongsTo(Fleet::class);
    }
}
