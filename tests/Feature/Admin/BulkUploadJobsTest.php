<?php

namespace Tests\Feature\Admin;

use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class BulkUploadJobsTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private CommunityJob $mission;
    private Airport $departureAirport;
    private Airport $arrivalAirport;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['is_admin' => true]);
        $tourAdminRole = Role::factory()->create(['role' => 'tour_admin']);
        $this->user->roles()->attach($tourAdminRole);

        $this->mission = CommunityJob::factory()->create([
            'is_published' => false,
            'is_completed' => false,
        ]);

        $this->departureAirport = Airport::factory()->create([
            'identifier' => 'KJFK',
            'name' => 'John F. Kennedy International Airport',
        ]);

        $this->arrivalAirport = Airport::factory()->create([
            'identifier' => 'KLAX',
            'name' => 'Los Angeles International Airport',
        ]);
    }

    public function test_bulk_upload_creates_jobs_successfully()
    {
        $csvContent = "departure_icao,arrival_icao,cargo_type,cargo,qty,is_recurring\n";
        $csvContent .= "KJFK,KLAX,1,Electronics,500,false\n";
        $csvContent .= "KJFK,KLAX,2,Passengers,120,true\n";

        $file = UploadedFile::fake()->createWithContent('jobs.csv', $csvContent);

        $response = $this->actingAs($this->user)
            ->post("/admin/missions/{$this->mission->id}/jobs/bulk-upload", [
                'file' => $file,
                'inject_immediately' => false,
            ]);

        $response->assertRedirect();

        $this->assertDatabaseCount('community_job_contracts', 2);

        $job1 = CommunityJobContract::where('cargo', 'Electronics')->first();
        $this->assertEquals('KJFK', $job1->dep_airport_id);
        $this->assertEquals('KLAX', $job1->arr_airport_id);
        $this->assertEquals(1, $job1->cargo_type);
        $this->assertEquals(500, $job1->payload);
        $this->assertFalse($job1->is_recurring);

        $job2 = CommunityJobContract::where('cargo', 'Passengers')->first();
        $this->assertEquals(2, $job2->cargo_type);
        $this->assertEquals(120, $job2->pax);
        $this->assertTrue($job2->is_recurring);
    }

    public function test_bulk_upload_handles_invalid_airports()
    {
        $csvContent = "departure_icao,arrival_icao,cargo_type,cargo,qty,is_recurring\n";
        $csvContent .= "INVALID,KLAX,1,Electronics,500,false\n";
        $csvContent .= "KJFK,INVALID2,2,Passengers,120,true\n";

        $file = UploadedFile::fake()->createWithContent('jobs.csv', $csvContent);

        $response = $this->actingAs($this->user)
            ->post("/admin/missions/{$this->mission->id}/jobs/bulk-upload", [
                'file' => $file,
                'inject_immediately' => false,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('community_job_contracts', 0);

        // Verify error results are stored in session
        $response->assertSessionHas('bulkUploadResults');
        $results = session('bulkUploadResults');
        $this->assertEquals(2, $results['total_rows']);
        $this->assertEquals(0, $results['successful']);
        $this->assertCount(2, $results['errors']);
    }

    public function test_bulk_upload_mixed_success_and_errors()
    {
        $csvContent = "departure_icao,arrival_icao,cargo_type,cargo,qty,is_recurring\n";
        $csvContent .= "KJFK,KLAX,1,Electronics,500,false\n"; // Valid
        $csvContent .= "INVALID,KLAX,1,Bad Job,250,false\n"; // Invalid departure
        $csvContent .= "KJFK,KLAX,2,Passengers,120,true\n"; // Valid

        $file = UploadedFile::fake()->createWithContent('jobs.csv', $csvContent);

        $response = $this->actingAs($this->user)
            ->post("/admin/missions/{$this->mission->id}/jobs/bulk-upload", [
                'file' => $file,
                'inject_immediately' => false,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('community_job_contracts', 2); // 2 successful jobs

        // Verify mixed results are properly reported
        $response->assertSessionHas('bulkUploadResults');
        $results = session('bulkUploadResults');
        $this->assertEquals(3, $results['total_rows']);
        $this->assertEquals(2, $results['successful']);
        $this->assertCount(1, $results['errors']);
        $this->assertEquals(3, $results['errors'][0]['row']); // The row with INVALID airport
    }

    public function test_bulk_upload_requires_valid_file()
    {
        $response = $this->actingAs($this->user)
            ->post("/admin/missions/{$this->mission->id}/jobs/bulk-upload", [
                'inject_immediately' => false,
            ]);

        $response->assertSessionHasErrors(['file']);
    }

    public function test_bulk_upload_requires_tour_admin_role()
    {
        $regularUser = User::factory()->create();

        $file = UploadedFile::fake()->create('jobs.csv');

        $response = $this->actingAs($regularUser)
            ->post("/admin/missions/{$this->mission->id}/jobs/bulk-upload", [
                'file' => $file,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('error');
    }

    public function test_bulk_upload_with_immediate_injection()
    {
        $this->mission->is_published = true;
        $this->mission->save();

        $csvContent = "departure_icao,arrival_icao,cargo_type,cargo,qty,is_recurring\n";
        $csvContent .= "KJFK,KLAX,1,Electronics,500,false\n";

        $file = UploadedFile::fake()->createWithContent('jobs.csv', $csvContent);

        $response = $this->actingAs($this->user)
            ->post("/admin/missions/{$this->mission->id}/jobs/bulk-upload", [
                'file' => $file,
                'inject_immediately' => true,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('community_job_contracts', 1);
        // Note: Testing contract creation would require more setup of the CreateCommunityContract service
    }
}
