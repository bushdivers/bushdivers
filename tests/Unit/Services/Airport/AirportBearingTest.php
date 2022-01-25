<?php

namespace Tests\Unit\Services\Airport;

use App\Services\Airports\CalcBearingBetweenPoints;
use Tests\TestCase;

class AirportBearingTest extends TestCase
{

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_bearing_between_moro_and_MH()
    {
        $calcBearing = $this->app->make(CalcBearingBetweenPoints::class);
        $heading = $calcBearing->execute(-6.36188, 143.23070, -5.82781, 144.29953, 5.51567);
        $this->assertEquals(57, $heading);
    }

    public function test_bearing_between_ayfo_and_aymr()
    {
        $calcBearing = $this->app->make(CalcBearingBetweenPoints::class);
        $heading = $calcBearing->execute(-6.50917, 143.07904, -6.36188, 143.23070, 5.33706);
        $this->assertEquals(40, $heading);
    }
}
