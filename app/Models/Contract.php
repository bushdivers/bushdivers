<?php

namespace App\Models;

use App\Models\Enums\CargoType;
use App\Models\Enums\ContractType as ContractTypEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

class Contract extends Model
{
    /**
    * @use HasFactory<\Database\Factories\ContractFactory>
    */
    use HasFactory;

    protected $fillable = [
        'contract_value',
    ];

    #[Override]
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'completed_at' => 'datetime',
            'contract_type_id' => ContractTypEnum::class,
            'cargo_type' => CargoType::class,
            'is_available' => 'boolean',
            'is_completed' => 'boolean',
            'is_custom' => 'boolean',
            'is_shared' => 'boolean',
            'is_fuel' => 'boolean',
            'is_paid' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<ContractType, $this>
     */
    public function type(): BelongsTo
    {
        return $this->belongsTo(ContractType::class, 'contract_type_id');
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function depAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'dep_airport_id');
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function arrAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'arr_airport_id');
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function currentAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'current_airport_id');
    }

    /**
     * @return BelongsTo<Aircraft, $this>
     */
    public function aircraft(): BelongsTo
    {
        return $this->belongsTo(Aircraft::class);
    }

    /**
     * @return BelongsTo<CommunityJobContract, $this>
     */
    public function communityJobContract(): BelongsTo
    {
        return $this->belongsTo(CommunityJobContract::class);
    }

}
