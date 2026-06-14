<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResourceCategory extends Model
{
    //use HasFactory;

    public $timestamps = false;

    /**
     * @return HasMany<Resource, $this>
     */
    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class, 'category_id', 'id');
    }
}
