<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourCheckpoint extends Model
{
    use HasFactory;

    public function airport()
    {
        return $this->belongsTo(Airport::class, 'checkpoint', 'identifier');
    }
}
