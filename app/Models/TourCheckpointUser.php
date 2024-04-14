<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourCheckpointUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'tour_id',
        'user_id',
        'section',
        'checkpoint'
    ];

    public function airport()
    {
        return $this->belongsTo(Airport::class, 'checkpoint', 'identifier');
    }
}
