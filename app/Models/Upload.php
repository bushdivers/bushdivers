<?php

namespace App\Models;

use App\Models\Enums\SimType;
use Illuminate\Database\Eloquent\Casts\AsEnumCollection;
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
        'sim_type',
        'author',
        'disk',
    ];

    public function casts(): array
    {
        return [
            'sim_type' => AsEnumCollection::of(SimType::class),

        ];
    }

    public function uploadable(): MorphTo
    {
        return $this->morphTo('uploadable');
    }
}
