<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PirepCargo extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function pirep(): BelongsTo
    {
        return $this->belongsTo(Pirep::class);
    }

    public function cargo(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }
}
