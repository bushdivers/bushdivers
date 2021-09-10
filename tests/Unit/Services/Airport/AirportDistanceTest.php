<?php

namespace Tests\Unit\Services\Airport;

use App\Services\AirportService;
use PHPUnit\Framework\TestCase;

class AirportDistanceTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_short_distance_between_moro_and_MH()
    {
        $airportService = new AirportService();
        $distance = $airportService->calculateDistanceBetweenPoints(-6.36188, 143.23070, -5.82781, 144.29953);
        $this->assertEquals(71.4, $distance);
    }

    public function test_mid_distance_between_moro_and_aypy()
    {
        $airportService = new AirportService();
        $distance = $airportService->calculateDistanceBetweenPoints(-6.36188, 143.23070, -9.442119, 147.217545);
        $this->assertEquals(300.7, $distance);
    }

    public function test_mid_distance_between_moro_and_heathrow()
    {
        $airportService = new AirportService();
        $distance = $airportService->calculateDistanceBetweenPoints(-6.36188, 143.23070, 51.472099, -0.452730);
        $this->assertEquals(7555.5, $distance);
    }
}
