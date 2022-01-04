<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourceCategory extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function resources()
    {
        return $this->hasMany(Resource::class, 'category_id', 'id');
    }
}
