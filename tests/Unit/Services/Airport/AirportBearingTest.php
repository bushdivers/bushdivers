<?php

namespace Tests\Unit\Services\Airport;

use App\Services\AirportService;
use PHPUnit\Framework\TestCase;

class AirportBearingTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_bearing_between_moro_and_MH()
    {
        $airportService = new AirportService();
        $heading = $airportService->calculateBearingBetweenPoints(-6.36188, 143.23070, -5.82781, 144.29953, 5.51567);
        $this->assertEquals(57, $heading);
    }
}
