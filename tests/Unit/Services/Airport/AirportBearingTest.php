<?php

namespace Tests\Unit\Services\Airport;

use App\Models\Airport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AirportBearingTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_bearing_between_moro_and_MH()
    {
        $moro = Airport::factory()->create([
            'identifier' => 'AYMR',
            'country' => 'PG',
            'is_hub' => false,
            'lat' => -6.36188,
            'lon' => 143.23070,
            'altitude' => 100
        ]);
        $mh = Airport::factory()->create([
            'identifier' => 'AYMH',
            'country' => 'PG',
            'is_hub' => false,
            'lat' => -5.82781,
            'lon' => 144.29953,
            'altitude' => 100
        ]);

        $heading = $moro->bearingTo($mh);
        $this->assertEquals(63, $heading); // 63.3
    }

    public function test_bearing_between_ayfo_and_aymr()
    {
        $ayfo = Airport::factory()->create([
            'identifier' => 'AYFO',
            'country' => 'PG',
            'is_hub' => false,
            'lat' => -6.50917,
            'lon' => 143.07904,
            'altitude' => 100
        ]);
        $aymr = Airport::factory()->create([
            'identifier' => 'AYMR',
            'country' => 'PG',
            'is_hub' => false,
            'lat' => -6.36188,
            'lon' => 143.23070,
            'altitude' => 100
        ]);

        $heading = $ayfo->bearingTo($aymr);
        $this->assertEquals(46, $heading); // 45.7
    }
}
