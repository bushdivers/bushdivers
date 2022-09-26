<?php

namespace Tests\Feature\Bot\TreasureHunt;

use App\Models\Pirep;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GetPirepTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_pirep_returned()
    {
        $pirep = Pirep::factory()->create([
            'is_manual' => false,
            'state' => 3
        ]);
        $headers = ['X-TOKEN' => env('BOT_TOKEN')];
        $response = $this->getJson('/api/bot/treasure/pirep/'.$pirep->id, $headers);

        $response->assertStatus(200);
        $response->assertJson([
            'departure' => $pirep->departure_airport_id
        ]);
    }

    public function test_pirep_not_found_when_manual()
    {
        $pirep = Pirep::factory()->create([
            'is_manual' => true,
            'state' => 3
        ]);
        $headers = ['X-TOKEN' => env('BOT_TOKEN')];
        $response = $this->getJson('/api/bot/treasure/pirep/'.$pirep->id, $headers);

        $response->assertStatus(404);
    }

    public function test_pirep_not_found_when_not_accepted()
    {
        $pirep = Pirep::factory()->create([
            'is_manual' => false,
            'state' => 1
        ]);
        $headers = ['X-TOKEN' => env('BOT_TOKEN')];
        $response = $this->getJson('/api/bot/treasure/pirep/'.$pirep->id, $headers);

        $response->assertStatus(404);
    }

    public function test_not_found_when_no_pirep_returned()
    {
        $headers = ['X-TOKEN' => env('BOT_TOKEN')];
        $response = $this->getJson('/api/bot/treasure/pirep/djkahjhsdjgashdgjas', $headers);

        $response->assertStatus(404);
    }
}
