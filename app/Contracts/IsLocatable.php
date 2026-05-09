<?php
namespace App\Contracts;

use Location\Coordinate;

interface IsLocatable
{
    public function getCoordinate(): Coordinate;

    public function distanceTo(IsLocatable $destination): float;
}
