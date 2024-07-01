<?php

namespace Tests\Unit\Services\Aircraft;

use App\Models\Aircraft;
use App\Services\Aircraft\UpdateAircraftFerry;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateAircraftFerryTest extends TestCase
{
    use RefreshDatabase;
    protected UpdateAircraftFerry $updateAircraftFerry;

    protected function setUp(): void
    {
        parent::setUp(); // TODO: Change the autogenerated stub
        $this->updateAircraftFerry = $this->app->make(UpdateAircraftFerry::class);
    }
    /**
     * A basic unit test example.
     */
    public function test_aircraft_ferry_removed(): void
    {
        $aircraft = Aircraft::factory()->create([
            'is_ferry' => true,
            'ferry_user_id' => 1,
            'hub_id' => 'EGCC',
            'fleet_id' => 1
        ]);
        $this->updateAircraftFerry->execute($aircraft->id, 'EGCC');
        $aircraft->refresh();
        $this->assertEquals(0, $aircraft->is_ferry);
        $this->assertNull($aircraft->ferry_user_id);
    }

    public function test_aircraft_ferry_not_removed(): void
    {
        $aircraft = Aircraft::factory()->create([
            'is_ferry' => true,
            'ferry_user_id' => 1,
            'hub_id' => 'EGCA',
            'fleet_id' => 1
        ]);

        $this->updateAircraftFerry->execute($aircraft->id, 'EGCC');
        $aircraft->refresh();
        $this->assertEquals(1, $aircraft->is_ferry);
        $this->assertNotNull($aircraft->ferry_user_id);
    }
}