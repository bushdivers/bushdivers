<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rental extends Model
{
    /**
     * @use HasFactory<\Database\Factories\RentalFactory>
     */
    use HasFactory;

    /**
     * @return BelongsTo<Fleet, $this>
     */
    public function fleet(): BelongsTo
    {
        return $this->belongsTo(Fleet::class);
    }

    /**
     * @return BelongsTo<FleetVariant, $this>
     */
    public function lastVariant(): BelongsTo
    {
        return $this->belongsTo(FleetVariant::class, 'fleet_variant_id');
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'current_airport_id');
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function hub(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'rental_airport_id');
    }
}
