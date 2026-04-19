<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CargoType extends Model
{
    protected $casts = [
        'type' => Enums\CargoType::class,
        'min_cargo_split' => 'integer',
    ];

    public $timestamps = false;

    protected $fillable = ['type', 'text', 'min_cargo_split'];
}
