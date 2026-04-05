<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CargoType extends Model
{
    protected $casts = [
        'type' => Enums\CargoType::class,
    ];

    public $timestamps = false;
}
