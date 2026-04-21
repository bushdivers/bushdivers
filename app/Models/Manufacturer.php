<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manufacturer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'logo_url'];

    public function aircraft()
    {
        $this->hasMany(Fleet::class);
    }
}
