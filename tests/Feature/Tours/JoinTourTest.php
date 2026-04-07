<?php

namespace Tests\Feature\Tours;

use App\Models\Airport;
use App\Models\Tour;
use App\Models\TourCheckpoint;
use App\Models\TourCheckpointUser;
use App\Models\TourUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JoinTourTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Tour $tour;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->tour = Tour::factory()->create(['title' => 'Bush Pilot Tour']);

        TourCheckpoint::factory()->create([
            'tour_id' => $this->tour->id,
            'section' => 1,
            'checkpoint_airport_id' => Airport::factory()->create()->id,
        ]);
        TourCheckpoint::factory()->create([
            'tour_id' => $this->tour->id,
            'section' => 2,
            'checkpoint_airport_id' => Airport::factory()->create()->id,
        ]);
    }

    public function test_user_can_join_tour(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('tour.join', ['id' => $this->tour->id]));

        $response->assertRedirect()->assertSessionHas('success');
        $this->assertDatabaseHas('tour_users', [
            'tour_id' => $this->tour->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_join_creates_checkpoint_entries_for_all_checkpoints(): void
    {
        $this->actingAs($this->user)
            ->post(route('tour.join', ['id' => $this->tour->id]));

        $this->assertDatabaseCount('tour_checkpoint_users', 2);
        $this->assertEquals(
            2,
            TourCheckpointUser::where('tour_id', $this->tour->id)
                ->where('user_id', $this->user->id)
                ->count()
        );
    }

    public function test_join_sets_initial_checkpoint_to_first_section(): void
    {
        $this->actingAs($this->user)
            ->post(route('tour.join', ['id' => $this->tour->id]));

        $firstCheckpoint = TourCheckpoint::where('tour_id', $this->tour->id)
            ->orderBy('section')
            ->first();

        $tourUser = TourUser::where('tour_id', $this->tour->id)
            ->where('user_id', $this->user->id)
            ->first();

        $this->assertEquals($firstCheckpoint->checkpoint_airport_id, $tourUser->next_airport_id);
    }
}
