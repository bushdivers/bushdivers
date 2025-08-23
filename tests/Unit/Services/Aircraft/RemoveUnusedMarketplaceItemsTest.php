<?php

namespace Tests\Unit\Services\Aircraft;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Fleet;
use App\Services\Aircraft\GenerateAircraft;
use App\Services\Aircraft\RemoveUnusedMarketplaceItems;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RemoveUnusedMarketplaceItemsTest extends TestCase
{
    use RefreshDatabase;

    protected Model $aircraft;
    protected Model $aircraftEngine;
    protected Model $fleet;
    protected RemoveUnusedMarketplaceItems $removeUnusedMarketplaceItems;
    protected GenerateAircraft $generateAircraft;

    protected function setUp(): void
    {
        parent::setUp();
        $this->fleet = Fleet::factory()->create();
        $this->removeUnusedMarketplaceItems = $this->app->make(RemoveUnusedMarketplaceItems::class);
        $this->generateAircraft = $this->app->make(GenerateAircraft::class);
    }

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_aircraft_cleared()
    {
        $this->assertEquals(0, Aircraft::count());

        $ap = Airport::factory()->create()->first();

        $this->generateAircraft->execute($this->fleet->id, $ap);

        $this->removeUnusedMarketplaceItems->execute();

        $count = Aircraft::count();
        $this->assertGreaterThanOrEqual(3, $count);

        $oldDate = now()->subDays(365);
        $ac = Aircraft::first();
        $ac->timestamps = false;
        $ac->owner_id = 0;
        $ac->created_at = $oldDate;
        $ac->updated_at = $oldDate;
        $ac->save();

        $this->removeUnusedMarketplaceItems->execute();
        $this->assertEquals($count, Aircraft::count());

        $ac->owner_id = null;
        $ac->save();

        $this->removeUnusedMarketplaceItems->execute();
        --$count;
        $this->assertEquals($count, Aircraft::count());
    }
}
