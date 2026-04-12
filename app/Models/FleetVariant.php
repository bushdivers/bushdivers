<?php

namespace App\Models;

use App\Models\Enums\SimType;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
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
        'sim_type',
    ];

    public function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'sim_type' => AsEnumCollection::of(SimType::class),
        ];
    }

    public function fleet(): BelongsTo
    {
        return $this->belongsTo(Fleet::class);
    }
}
