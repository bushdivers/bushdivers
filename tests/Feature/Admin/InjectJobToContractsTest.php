<?php

namespace Tests\Feature\Admin;

use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Models\Contract;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InjectJobToContractsTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected CommunityJob $publishedMission;
    protected CommunityJob $unpublishedMission;
    protected CommunityJobContract $publishedJob;
    protected CommunityJobContract $unpublishedJob;

    protected function setUp(): void
    {
        parent::setUp();

        // Create required airports
        $aymr = Airport::factory()->create([
            'identifier' => 'AYMR',
            'name' => 'Test Departure Airport',
            'lat' => -5.8269,
            'lon' => 144.2956,
            'magnetic_variance' => 0
        ]);

        $aymn = Airport::factory()->create([
            'identifier' => 'AYMN',
            'name' => 'Test Arrival Airport',
            'lat' => -6.0824,
            'lon' => 145.3918,
            'magnetic_variance' => 0
        ]);

        // Create admin user with tour_admin role
        $this->admin = User::factory()->create();
        $tourAdminRole = Role::factory()->create(['role' => 'tour_admin']);
        $this->admin->roles()->attach($tourAdminRole);

        // Create regular user
        $this->regularUser = User::factory()->create();

        // Create published mission
        $this->publishedMission = CommunityJob::factory()->create([
            'name' => 'Published Mission',
            'description' => 'Test Description',
            'is_published' => true
        ]);

        // Create unpublished mission
        $this->unpublishedMission = CommunityJob::factory()->create([
            'name' => 'Unpublished Mission',
            'description' => 'Test Description',
            'is_published' => false
        ]);

        // Create job for published mission
        $this->publishedJob = CommunityJobContract::factory()->create([
            'community_job_id' => $this->publishedMission->id,
            'dep_airport_id' => $aymr->id,
            'arr_airport_id' => $aymn->id,
            'cargo_type' => 1,
            'payload' => 1000,
            'cargo' => 'Medical Supplies'
        ]);

        // Create job for unpublished mission
        $this->unpublishedJob = CommunityJobContract::factory()->create([
            'community_job_id' => $this->unpublishedMission->id,
            'dep_airport_id' => $aymr->id,
            'arr_airport_id' => $aymn->id,
            'cargo_type' => 1,
            'payload' => 500,
            'cargo' => 'Emergency Supplies'
        ]);
    }

    public function test_admin_can_inject_published_mission_job_to_contracts()
    {
        // Ensure no contracts exist initially
        $this->assertEquals(0, Contract::count());

        // Make request to inject job
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$this->publishedJob->id}/inject");

        // Assert successful redirect response
        $response->assertStatus(302)
            ->assertSessionHas('success');

        // Assert contract was created
        $this->assertEquals(1, Contract::count());

        $contract = Contract::first();
        $this->assertEquals($this->publishedJob->dep_airport_id, $contract->dep_airport_id);
        $this->assertEquals($this->publishedJob->arr_airport_id, $contract->arr_airport_id);
        $this->assertEquals($this->publishedJob->cargo, $contract->cargo);
        $this->assertEquals($this->publishedJob->cargo_type, $contract->cargo_type);
        $this->assertEquals($this->publishedJob->payload, $contract->cargo_qty);
        $this->assertEquals($this->publishedJob->id, $contract->community_job_contract_id);
    }

    public function test_admin_cannot_inject_unpublished_mission_job_to_contracts()
    {
        // Ensure no contracts exist initially
        $this->assertEquals(0, Contract::count());

        // Make request to inject job from unpublished mission
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$this->unpublishedJob->id}/inject");

        // Assert error response
        $response->assertStatus(302)
            ->assertSessionHas('error');

        // Assert no contract was created
        $this->assertEquals(0, Contract::count());
    }

    public function test_non_admin_user_cannot_inject_job_to_contracts()
    {
        // Make request as regular user
        $response = $this->actingAs($this->regularUser)
            ->from('/admin/missions/' . $this->publishedMission->id)
            ->post("/admin/missions/jobs/{$this->publishedJob->id}/inject");

        // Should be redirected back with error due to role middleware
        $response->assertRedirect('/admin/missions/' . $this->publishedMission->id);
        $response->assertSessionHas('error');

        // Assert no contract was created
        $this->assertEquals(0, Contract::count());
    }

    public function test_unauthenticated_user_cannot_inject_job_to_contracts()
    {
        // Make request without authentication
        $response = $this->post("/admin/missions/jobs/{$this->publishedJob->id}/inject");

        // Should redirect to login
        $response->assertRedirect(route('login.index'));

        // Assert no contract was created
        $this->assertEquals(0, Contract::count());
    }

    public function test_inject_job_returns_404_for_non_existent_job()
    {
        $nonExistentJobId = 99999;

        // Make request with non-existent job ID
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$nonExistentJobId}/inject");

        // Should return 404
        $response->assertStatus(404);

        // Assert no contract was created
        $this->assertEquals(0, Contract::count());
    }

    public function test_inject_job_works_for_passenger_cargo_type()
    {
        // Create a passenger job
        $passengerJob = CommunityJobContract::factory()->create([
            'community_job_id' => $this->publishedMission->id,
            'dep_airport_id' => $this->publishedJob->dep_airport_id,
            'arr_airport_id' => $this->publishedJob->arr_airport_id,
            'cargo_type' => 2,
            'pax' => 15,
            'cargo' => 'Passengers'
        ]);

        // Make request to inject passenger job
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$passengerJob->id}/inject");

        // Assert successful response
        $response->assertStatus(302)
            ->assertSessionHas('success');

        // Assert contract was created with passenger data
        $contract = Contract::first();
        $this->assertEquals(2, $contract->cargo_type);
        $this->assertEquals(15, $contract->cargo_qty);
        $this->assertEquals('Passengers', $contract->cargo);
    }
}
