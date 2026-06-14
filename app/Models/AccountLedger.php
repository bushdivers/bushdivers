<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountLedger extends Model
{
    /**
     * @use HasFactory<\Database\Factories\AccountLedgerFactory>
     */
    use HasFactory;

    /**
     * @return BelongsTo<Pirep, $this>
     */
    public function pirep(): BelongsTo
    {
        return $this->belongsTo(Pirep::class);
    }

    public static function getBalance(): float
    {
        return static::sum('total');
    }
}
