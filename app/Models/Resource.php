<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    // INFO: filename = package name

    use HasFactory;

    protected $casts = [
        'dependencies' => 'array'
    ];

    protected $appends = [
        'calculated_file_size'
    ];

    public function getCalculatedFileSizeAttribute()
    {
        $originalSize = $this->file_size / 1024;
        $size = round($originalSize, 2).'kb';
        if ($originalSize >= 1024) {
            $originalSize = $originalSize / 1024;
            $size = round($originalSize, 2).'mb';
            if ($originalSize >= 1024) {
                $originalSize = $originalSize / 1024;
                $size = round($originalSize, 2).'gb';
            }
        }

        return $size;
    }

    public function category()
    {
        return $this->belongsTo(ResourceCategory::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
