<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityJobContract extends Model
{
    use HasFactory;

    protected $casts = [
        'is_completed' => 'boolean'
    ];
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function communityJob()
    {
        return $this->belongsTo(CommunityJob::class);
    }

}
