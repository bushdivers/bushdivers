<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountLedger extends Model
{
    use HasFactory;

    public function pirep(): BelongsTo
    {
        return $this->belongsTo(Pirep::class);
    }

    public static function getBalance(): float
    {
        return static::sum('total');
    }
}
