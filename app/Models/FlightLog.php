<?php

namespace App\Models;

use App\Contracts\IsLocatable;
use App\Models\Concerns\HasLocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Location\Coordinate;

class FlightLog extends Model implements IsLocatable
{
    /**
     * @use HasFactory<\Database\Factories\FlightLogFactory>
     */
    use HasFactory;
    use HasLocation;

    public function getCoordinate(): Coordinate
    {
        return new Coordinate($this->lat, $this->lon);
    }
}
