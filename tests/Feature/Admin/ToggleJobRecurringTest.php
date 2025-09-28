<?php

namespace Tests\Feature\Admin;

use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ToggleJobRecurringTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $regularUser;
    protected CommunityJob $mission;
    protected CommunityJobContract $job;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user with tour_admin role
        $this->admin = User::factory()->create(['is_admin' => true]);
        $tourAdminRole = Role::factory()->create(['role' => 'tour_admin']);
        $this->admin->roles()->attach($tourAdminRole);

        // Create regular user
        $this->regularUser = User::factory()->create();

        // Create a mission
        $this->mission = CommunityJob::factory()->create([
            'name' => 'Test Mission',
            'description' => 'Test Description',
            'is_published' => false
        ]);

        // Create a job for the mission
        $this->job = CommunityJobContract::factory()->create([
            'community_job_id' => $this->mission->id,
            'is_recurring' => false,
            'dep_airport_id' => Airport::factory()->create(['identifier' => 'AYMR']),
            'arr_airport_id' => Airport::factory()->create(['identifier' => 'AYMN'])
        ]);
    }

    public function test_admin_can_toggle_job_recurring_status_from_false_to_true()
    {
        // Ensure job is not recurring initially
        $this->assertFalse($this->job->is_recurring);

        // Make request to toggle recurring status
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$this->job->id}/toggle-recurring");

        // Assert successful redirect response
        $response->assertStatus(302)
            ->assertSessionHas('success');

        // Assert database was updated
        $this->assertDatabaseHas('community_job_contracts', [
            'id' => $this->job->id,
            'is_recurring' => true
        ]);

        // Refresh the model and verify
        $this->job->refresh();
        $this->assertTrue($this->job->is_recurring);
    }

    public function test_admin_can_toggle_job_recurring_status_from_true_to_false()
    {
        // Set job as recurring initially
        $this->job->is_recurring = true;
        $this->job->save();
        $this->assertTrue($this->job->fresh()->is_recurring);

        // Make request to toggle recurring status
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$this->job->id}/toggle-recurring");

        // Assert successful redirect response
        $response->assertStatus(302)
            ->assertSessionHas('success');

        // Assert database was updated
        $this->assertDatabaseHas('community_job_contracts', [
            'id' => $this->job->id,
            'is_recurring' => false
        ]);

        // Refresh the model and verify
        $this->job->refresh();
        $this->assertFalse($this->job->is_recurring);
    }

    public function test_admin_can_toggle_job_recurring_status_even_after_mission_is_published()
    {
        // Publish the mission
        $this->mission->is_published = true;
        $this->mission->save();

        // Ensure job is not recurring initially
        $this->assertFalse($this->job->is_recurring);

        // Make request to toggle recurring status
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$this->job->id}/toggle-recurring");

        // Assert successful redirect response
        $response->assertStatus(302)
            ->assertSessionHas('success');

        // Assert database was updated
        $this->assertDatabaseHas('community_job_contracts', [
            'id' => $this->job->id,
            'is_recurring' => true
        ]);
    }

    public function test_non_admin_user_cannot_toggle_job_recurring_status()
    {
        // Make request as regular user with a referrer URL
        $response = $this->actingAs($this->regularUser)
            ->from('/admin/missions/' . $this->mission->id)
            ->post("/admin/missions/jobs/{$this->job->id}/toggle-recurring");

        // Should be redirected back with error due to role middleware
        $response->assertRedirect('/admin/missions/' . $this->mission->id);
        $response->assertSessionHas('error');

        // Assert database was NOT updated
        $this->assertDatabaseHas('community_job_contracts', [
            'id' => $this->job->id,
            'is_recurring' => false
        ]);
    }

    public function test_unauthenticated_user_cannot_toggle_job_recurring_status()
    {
        // Make request without authentication
        $response = $this->post("/admin/missions/jobs/{$this->job->id}/toggle-recurring");

        // Should redirect to login
        $response->assertRedirect(route('login.index'));

        // Assert database was NOT updated
        $this->assertDatabaseHas('community_job_contracts', [
            'id' => $this->job->id,
            'is_recurring' => false
        ]);
    }

    public function test_toggle_job_recurring_returns_404_for_non_existent_job()
    {
        $nonExistentJobId = 99999;

        // Make request with non-existent job ID
        $response = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$nonExistentJobId}/toggle-recurring");

        // Should return 404
        $response->assertStatus(404);
    }

    public function test_multiple_toggles_work_correctly()
    {
        // Initial state: not recurring
        $this->assertFalse($this->job->is_recurring);

        // First toggle: false -> true
        $response1 = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$this->job->id}/toggle-recurring");

        $response1->assertStatus(302)
            ->assertSessionHas('success');
        $this->job->refresh();
        $this->assertTrue($this->job->is_recurring);

        // Second toggle: true -> false
        $response2 = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$this->job->id}/toggle-recurring");

        $response2->assertStatus(302)
            ->assertSessionHas('success');
        $this->job->refresh();
        $this->assertFalse($this->job->is_recurring);

        // Third toggle: false -> true
        $response3 = $this->actingAs($this->admin)
            ->post("/admin/missions/jobs/{$this->job->id}/toggle-recurring");

        $response3->assertStatus(302)
            ->assertSessionHas('success');
        $this->job->refresh();
        $this->assertTrue($this->job->is_recurring);
    }
}
