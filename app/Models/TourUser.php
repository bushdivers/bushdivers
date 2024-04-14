<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourUser extends Model
{
    use HasFactory;

    protected $fillable = ['tour_id', 'user_id', 'next_checkpoint'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tours()
    {
        return $this->hasMany(Tour::class);
    }
}
