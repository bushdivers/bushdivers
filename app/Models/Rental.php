<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rental extends Model
{
    use HasFactory;

    public function fleet(): BelongsTo
    {
        return $this->belongsTo(Fleet::class);
    }

    public function lastVariant(): BelongsTo
    {
        return $this->belongsTo(FleetVariant::class, 'fleet_variant_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'current_airport_id');
    }

    public function hub(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'rental_airport_id');
    }
}
