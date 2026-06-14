<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommunityJob extends Model
{
    /**
     * @use HasFactory<\Database\Factories\CommunityJobFactory>
     */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'allow_private',
        'hub_airport_id',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_completed' => 'boolean',
        'allow_private' => 'boolean'
    ];

    /**
     * @return HasMany<CommunityJobContract, $this>
     */
    public function jobs(): HasMany
    {
        return $this->hasMany(CommunityJobContract::class);
    }

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function hubAirport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'hub_airport_id');
    }

    protected static function booted()
    {
        static::deleting(function (CommunityJob $job) {
            if ($job->is_published) {
                throw new \Exception('Cannot delete a published job');
            }
        });
    }
}
