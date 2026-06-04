<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommunityJob extends Model
{
    use HasFactory;

    protected $casts = [
        'is_published' => 'boolean',
        'is_completed' => 'boolean',
        'allow_private' => 'boolean'
    ];

    public function jobs(): HasMany
    {
        return $this->hasMany(CommunityJobContract::class);
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
