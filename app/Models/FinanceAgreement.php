<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinanceAgreement extends Model
{
    use HasFactory;

    protected $casts = [
        'last_payment_at' => 'datetime'
    ];

    public function aircraft()
    {
        return $this->belongsTo(Aircraft::class);
    }
}
