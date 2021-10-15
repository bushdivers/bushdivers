<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountLedger extends Model
{
    use HasFactory;

    public function pirep()
    {
        return $this->belongsTo(Pirep::class);
    }
}
