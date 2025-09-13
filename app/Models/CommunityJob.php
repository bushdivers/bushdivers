<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityJob extends Model
{
    use HasFactory;

    protected $casts = [
        'is_published' => 'boolean',
        'is_completed' => 'boolean',
        'allow_private' => 'boolean'
    ];

    public function jobs()
    {
        return $this->hasMany(CommunityJobContract::class);
    }
}
