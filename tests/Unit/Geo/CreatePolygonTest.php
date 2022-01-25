<?php

namespace Tests\Unit\Geo;

use App\Services\Geo\CreatePolygon;
use PHPUnit\Framework\TestCase;

class CreatePolygonTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     *
     */
    public function test_polygon_has_correct_number_points()
    {
        $poly = new CreatePolygon();
        $num = $poly->execute(52.24166, -2.88111, 50);
        $this->assertEquals(17, count($num));
    }

    public function test_polygon_has_same_start_and_end()
    {
        $poly = new CreatePolygon(52.24166, -2.88111, 50);
        $polygon = $poly->execute(52.24166, -2.88111, 50);
        $this->assertEquals($polygon[0][0], $polygon[16][0]);
    }
}
