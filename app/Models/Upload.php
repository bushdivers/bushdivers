<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Upload extends Model
{
    use HasFactory;

    protected $fillable = [
        'url',
        'upload_type',
        'display_name',
        'size',
    ];

    public function uploadable(): MorphTo
    {
        return $this->morphTo('uploadable');
    }
}
