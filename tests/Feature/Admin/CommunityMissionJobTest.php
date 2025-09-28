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

class CommunityMissionJobTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected CommunityJob $publishedMission;
    protected CommunityJob $unpublishedMission;
    protected Airport $aymr;
    protected Airport $aymn;

    protected function setUp(): void
    {
        parent::setUp();

        // Create required airports
        $this->aymr = Airport::factory()->create([
            'identifier' => 'AYMR',
            'name' => 'Test Departure Airport',
            'lat' => -5.8269,
            'lon' => 144.2956,
            'magnetic_variance' => 0,
        ]);

        $this->aymn = Airport::factory()->create([
            'identifier' => 'AYMN',
            'name' => 'Test Arrival Airport',
            'lat' => -6.0824,
            'lon' => 145.3918,
            'magnetic_variance' => 0,
        ]);

        // Create admin user with tour_admin role
        $this->admin = User::factory()->create(['is_admin' => true]);
        $tourAdminRole = Role::factory()->create(['role' => 'tour_admin']);
        $this->admin->roles()->attach($tourAdminRole);

        // Create published mission
        $this->publishedMission = CommunityJob::factory()->create([
            'name' => 'Published Mission',
            'description' => 'Test Description',
            'is_published' => true,
        ]);

        // Create unpublished mission
        $this->unpublishedMission = CommunityJob::factory()->create([
            'name' => 'Unpublished Mission',
            'description' => 'Test Description',
            'is_published' => false,
        ]);
    }

    public function test_admin_can_add_job_to_published_mission_without_injection()
    {
        $jobData = [
            'departure' => 'AYMR',
            'destination' => 'AYMN',
            'cargo_type' => 1,
            'cargo' => 'Medical Supplies',
            'qty' => 1000,
            'recurring' => 0,
            'inject_immediately' => false,
        ];

        // Ensure no jobs or contracts exist initially
        $this->assertEquals(0, CommunityJobContract::count());
        $this->assertEquals(0, Contract::count());

        // Make request to add job
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/{$this->publishedMission->id}/jobs", $jobData);

        // Assert successful redirect
        $response->assertStatus(302)
            ->assertSessionHas('success');

        // Assert job was created but no contract
        $this->assertEquals(1, CommunityJobContract::count());
        $this->assertEquals(0, Contract::count());

        // Verify job details
        $job = CommunityJobContract::first();
        $this->assertEquals($this->aymr->id, $job->dep_airport_id);
        $this->assertEquals($this->aymn->id, $job->arr_airport_id);
        $this->assertEquals(1, $job->cargo_type);
        $this->assertEquals('Medical Supplies', $job->cargo);
        $this->assertEquals(1000, $job->payload);
    }

    public function test_admin_can_add_job_to_published_mission_with_injection()
    {
        $jobData = [
            'departure' => 'AYMR',
            'destination' => 'AYMN',
            'cargo_type' => 1,
            'cargo' => 'Medical Supplies',
            'qty' => 1000,
            'recurring' => 0,
            'inject_immediately' => true,
        ];

        // Ensure no jobs or contracts exist initially
        $this->assertEquals(0, CommunityJobContract::count());
        $this->assertEquals(0, Contract::count());

        // Make request to add job with injection
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/{$this->publishedMission->id}/jobs", $jobData);

        // Assert successful redirect with injection message
        $response->assertStatus(302)
            ->assertSessionHas('success');

        // Assert both job and contract were created
        $this->assertEquals(1, CommunityJobContract::count());
        $this->assertEquals(1, Contract::count());

        // Verify job details
        $job = CommunityJobContract::first();
        $this->assertEquals($this->aymr->id, $job->dep_airport_id);
        $this->assertEquals($this->aymn->id, $job->arr_airport_id);

        // Verify contract details
        $contract = Contract::first();
        $this->assertEquals($this->aymr->id, $contract->dep_airport_id);
        $this->assertEquals($this->aymn->id, $contract->arr_airport_id);
        $this->assertEquals('Medical Supplies', $contract->cargo);
        $this->assertEquals(1, $contract->cargo_type);
        $this->assertEquals(1000, $contract->cargo_qty);
        $this->assertEquals($job->id, $contract->community_job_contract_id);
    }

    public function test_admin_can_add_job_to_unpublished_mission_injection_ignored()
    {
        $jobData = [
            'departure' => 'AYMR',
            'destination' => 'AYMN',
            'cargo_type' => 1,
            'cargo' => 'Medical Supplies',
            'qty' => 1000,
            'recurring' => 0,
            'inject_immediately' => true, // This should be ignored for unpublished mission
        ];

        // Ensure no jobs or contracts exist initially
        $this->assertEquals(0, CommunityJobContract::count());
        $this->assertEquals(0, Contract::count());

        // Make request to add job to unpublished mission
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/{$this->unpublishedMission->id}/jobs", $jobData);

        // Assert successful redirect but no injection
        $response->assertStatus(302)
            ->assertSessionHas('success');

        // Assert job was created but no contract (injection ignored for unpublished mission)
        $this->assertEquals(1, CommunityJobContract::count());
        $this->assertEquals(0, Contract::count());
    }

    public function test_admin_can_add_passenger_job_with_injection()
    {
        $jobData = [
            'departure' => 'AYMR',
            'destination' => 'AYMN',
            'cargo_type' => 2,
            'cargo' => 'Passengers',
            'qty' => 25,
            'recurring' => 1,
            'inject_immediately' => true,
        ];

        // Make request to add passenger job with injection
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/{$this->publishedMission->id}/jobs", $jobData);

        // Assert successful redirect with injection message
        $response->assertStatus(302)
            ->assertSessionHas('success');

        // Assert both job and contract were created
        $this->assertEquals(1, CommunityJobContract::count());
        $this->assertEquals(1, Contract::count());

        // Verify passenger job details
        $job = CommunityJobContract::first();
        $this->assertEquals(2, $job->cargo_type);
        $this->assertEquals(25, $job->pax);
        $this->assertEquals(true, $job->is_recurring);

        // Verify passenger contract details
        $contract = Contract::first();
        $this->assertEquals(2, $contract->cargo_type);
        $this->assertEquals(25, $contract->cargo_qty);
        $this->assertEquals('Passengers', $contract->cargo);
    }
}
