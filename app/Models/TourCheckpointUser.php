<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TourCheckpointUser extends Model
{
    /**
     * @use HasFactory<\Database\Factories\TourCheckpointUserFactory>
     */
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'user_id',
        'section',
        'checkpoint_airport_id'
    ];

    /**
     * @return BelongsTo<Airport, $this>
     */
    public function airport(): BelongsTo
    {
        return $this->belongsTo(Airport::class, 'checkpoint_airport_id');
    }
}
