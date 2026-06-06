<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Manufacturer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'logo_url'];

    /**
     * @return HasMany<Fleet, $this>
     */
    public function fleet(): HasMany
    {
        return $this->hasMany(Fleet::class);
    }
}
