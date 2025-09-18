<?php

namespace Tests\Feature\Admin;

use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BulkUploadVisualFeedbackTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $mission;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $role = Role::factory()->create(['role' => 'tour_admin']);
        $this->user = User::factory()->create();
        $this->user->roles()->attach($role);

        // Create a mission
        $this->mission = CommunityJob::factory()->create([
            'name' => 'Test Mission',
            'is_published' => true
        ]);

        // Create test airports for the bulk upload
        Airport::factory()->create(['identifier' => 'KJFK']);
        Airport::factory()->create(['identifier' => 'KLAX']);
    }

    public function test_bulk_upload_session_data_is_passed_to_frontend()
    {
        // Create CSV content with both valid and invalid data
        $csvContent = "departure_icao,arrival_icao,cargo_type,cargo,qty,is_recurring\n";
        $csvContent .= "KJFK,KLAX,1,Electronics,500,false\n";  // Valid
        $csvContent .= "INVALID,KLAX,1,Electronics,500,false\n"; // Invalid departure
        $csvContent .= "KJFK,BADCODE,1,Electronics,500,false\n"; // Invalid arrival

        $file = UploadedFile::fake()->createWithContent('test.csv', $csvContent);

        $response = $this->actingAs($this->user)
            ->post("/admin/missions/{$this->mission->id}/jobs/bulk-upload", [
                'file' => $file,
                'inject_immediately' => '0'
            ]);

        // Should redirect back to mission details
        $response->assertRedirectBack();

        // Follow the redirect and check if the results are in the response
        $response = $this->actingAs($this->user)
            ->get("/admin/missions/{$this->mission->id}");

        $response->assertStatus(200);

        // Check if Inertia props contain bulkUploadResults
        $page = $response->viewData('page');
        $props = $page['props'];

        $this->assertArrayHasKey('bulkUploadResults', $props);
        $this->assertNotNull($props['bulkUploadResults']);

        $results = $props['bulkUploadResults'];
        $this->assertEquals(3, $results['total_rows']);
        $this->assertEquals(1, $results['successful']);
        $this->assertCount(2, $results['errors']);
    }

    public function test_bulk_upload_results_are_cleared_after_first_view()
    {
        // Upload a file
        $csvContent = "departure_icao,arrival_icao,cargo_type,cargo,qty,is_recurring\n";
        $csvContent .= "KJFK,KLAX,1,Electronics,500,0\n";

        $file = UploadedFile::fake()->createWithContent('test.csv', $csvContent);

        $this->actingAs($this->user)
            ->post("/admin/missions/{$this->mission->id}/jobs/bulk-upload", [
                'file' => $file,
                'inject_immediately' => '0'
            ]);

        // First request should have results
        $response = $this->actingAs($this->user)
            ->get("/admin/missions/{$this->mission->id}");

        $page = $response->viewData('page');
        $this->assertArrayHasKey('bulkUploadResults', $page['props']);
        $this->assertNotNull($page['props']['bulkUploadResults']);

        // Second request should not have results (cleared from session)
        $response = $this->actingAs($this->user)
            ->get("/admin/missions/{$this->mission->id}");

        $page = $response->viewData('page');
        $this->assertArrayNotHasKey('bulkUploadResults', $page['props']);
    }
}
