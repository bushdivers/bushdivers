<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinanceAgreement extends Model
{
    use HasFactory;

    protected $casts = [
        'last_payment_at' => 'datetime'
    ];

    public function aircraft(): BelongsTo
    {
        return $this->belongsTo(Aircraft::class);
    }
}
