<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FleetVariant extends Model
{
    use HasFactory;
    protected $fillable = [
        'fleet_id',
        'name',
        'is_default',
        'pax_capacity',
        'cargo_capacity',
        'fuel_capacity',
        'range',
        'mtow',
        'zfw',
    ];

    public function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function fleet(): BelongsTo
    {
        return $this->belongsTo(Fleet::class);
    }
}
