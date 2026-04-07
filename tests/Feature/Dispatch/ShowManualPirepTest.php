<?php

namespace Tests\Feature\Dispatch;

use App\Models\Pirep;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ShowManualPirepTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    public function test_can_open(): void
    {
        $pirep = Pirep::factory()->inProgress()->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this
            ->actingAs($this->user)
            ->get(route('pireps.submit'));

        $response->assertInertia(
            fn (AssertableInertia $page) => $page->where('pirep.id', $pirep->id)
        );
    }

    public function test_fails_if_no_pirep(): void
    {
        $response = $this
            ->actingAs($this->user)
            ->get(route('pireps.submit'));

        $response->assertNotFound();
    }

    public function test_fails_if_other_users_pirep(): void
    {
        $otherUser = User::factory()->create();
        $pirep = Pirep::factory()->inProgress()->create([
            'user_id' => $otherUser->id,
        ]);

        $response = $this
            ->actingAs($this->user)
            ->get(route('pireps.submit'));

        $response->assertNotFound();
    }

    public function test_fails_if_pirep_not_in_progress(): void
    {
        $pirep = Pirep::factory()->complete()->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this
            ->actingAs($this->user)
            ->get(route('pireps.submit'));

        $response->assertNotFound();
    }
}
