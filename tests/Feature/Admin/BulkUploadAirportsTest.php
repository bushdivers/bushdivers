<?php

namespace Tests\Feature\Admin;

use App\Models\Airport;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class BulkUploadAirportsTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $role = Role::factory()->create(['role' => 'airport_manager']);
        $this->user = User::factory()->create();
        $this->user->roles()->attach($role);
    }

    public function test_can_bulk_upload_airports_with_valid_data()
    {
        // Create CSV content with all required fields
        $csvContent = "identifier,name,location,country,country_code,lat,lon,magnetic_variance,altitude,size,longest_runway_length,longest_runway_width,longest_runway_surface,has_avgas,has_jetfuel\n"
            . "TEST,Test Airport,Test Location,United States,US,-33.9469,18.6017,0,14,3,2500,75,ASPHALT,true,false\n"
            . 'DEMO,Demo Airport,Demo Location,Canada,CA,43.6777,-79.6248,0,173,4,3000,100,CONCRETE,false,true';

        $file = UploadedFile::fake()->createWithContent('airports.csv', $csvContent);

        // First visit the airports page to set the referrer
        $this->actingAs($this->user)->get('/admin/airports');

        $response = $this->actingAs($this->user)->post('/admin/airports/bulk-upload', [
            'file' => $file,
        ]);

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('bulkUploadResults');

        // Check that airports were created
        $this->assertDatabaseHas('airports', [
            'identifier' => 'TEST',
            'name' => 'Test Airport',
            'location' => 'Test Location',
            'country' => 'United States',
            'country_code' => 'US',
            'lat' => -33.9469,
            'lon' => 18.6017,
            'altitude' => 14,
            'longest_runway_surface' => 'A',
        ]);

        $this->assertDatabaseHas('airports', [
            'identifier' => 'DEMO',
            'name' => 'Demo Airport',
            'location' => 'Demo Location',
            'country' => 'Canada',
            'country_code' => 'CA',
            'lat' => 43.6777,
            'lon' => -79.6248,
            'altitude' => 173,
            'longest_runway_surface' => 'C',
        ]);

        $results = session('bulkUploadResults');
        $this->assertArrayHasKey('successful', $results);
        $this->assertArrayHasKey('errors', $results);
        $this->assertArrayHasKey('total_rows', $results);
        $this->assertEquals(2, $results['successful']);
        $this->assertCount(0, $results['errors']);
        $this->assertEquals(2, $results['total_rows']);
    }

    public function test_validates_required_fields()
    {
        // CSV with missing required fields
        $csvContent = "identifier,name,location,country,country_code,lat,lon,magnetic_variance,altitude,size,longest_runway_length,longest_runway_width,longest_runway_surface,has_avgas,has_jetfuel\n"
            . ",Test Airport,Test Location,United States,US,-33.9469,18.6017,0,14,3,2500,75,ASPHALT,true,false\n"
            . 'DEMO,,Demo Location,Canada,CA,43.6777,-79.6248,0,173,4,3000,100,CONCRETE,false,true';

        $file = UploadedFile::fake()->createWithContent('airports.csv', $csvContent);

        // First visit the airports page to set the referrer
        $this->actingAs($this->user)->get('/admin/airports');

        $response = $this->actingAs($this->user)->post('/admin/airports/bulk-upload', [
            'file' => $file,
        ]);

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('bulkUploadResults');

        $results = session('bulkUploadResults');
        $this->assertEquals(0, $results['successful']);
        $this->assertCount(2, $results['errors']);
    }

    public function test_validates_unique_identifiers()
    {
        // Create existing airport
        Airport::factory()->create(['identifier' => 'EXISTING']);

        $csvContent = "identifier,name,location,country,country_code,lat,lon,magnetic_variance,altitude,size,longest_runway_length,longest_runway_width,longest_runway_surface,has_avgas,has_jetfuel\n"
            . 'EXISTING,Test Airport,Test Location,United States,US,-33.9469,18.6017,0,14,3,2500,75,ASPHALT,true,false';

        $file = UploadedFile::fake()->createWithContent('airports.csv', $csvContent);

        // First visit the airports page to set the referrer
        $this->actingAs($this->user)->get('/admin/airports');

        $response = $this->actingAs($this->user)->post('/admin/airports/bulk-upload', [
            'file' => $file,
        ]);

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('bulkUploadResults');

        $results = session('bulkUploadResults');
        $this->assertEquals(0, $results['successful']);
        $this->assertCount(1, $results['errors']);
    }

    public function test_validates_coordinate_ranges()
    {
        $csvContent = "identifier,name,location,country,country_code,lat,lon,magnetic_variance,altitude,size,longest_runway_length,longest_runway_width,longest_runway_surface,has_avgas,has_jetfuel\n"
            . 'TEST,Test Airport,Test Location,United States,US,91,181,0,14,3,2500,75,ASPHALT,true,false';

        $file = UploadedFile::fake()->createWithContent('airports.csv', $csvContent);

        // First visit the airports page to set the referrer
        $this->actingAs($this->user)->get('/admin/airports');

        $response = $this->actingAs($this->user)->post('/admin/airports/bulk-upload', [
            'file' => $file,
        ]);

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('bulkUploadResults');

        $results = session('bulkUploadResults');
        $this->assertEquals(0, $results['successful']);
        $this->assertCount(1, $results['errors']);
    }

    public function test_detects_duplicate_identifiers_in_file()
    {
        $csvContent = "identifier,name,location,country,country_code,lat,lon,magnetic_variance,altitude,size,longest_runway_length,longest_runway_width,longest_runway_surface,has_avgas,has_jetfuel\n"
            . "DUPE,Test Airport 1,Test Location 1,United States,US,-33.9469,18.6017,0,14,3,2500,75,ASPHALT,true,false\n"
            . 'DUPE,Test Airport 2,Test Location 2,Canada,CA,43.6777,-79.6248,0,173,4,3000,100,CONCRETE,false,true';

        $file = UploadedFile::fake()->createWithContent('airports.csv', $csvContent);

        // First visit the airports page to set the referrer
        $this->actingAs($this->user)->get('/admin/airports');

        $response = $this->actingAs($this->user)->post('/admin/airports/bulk-upload', [
            'file' => $file,
        ]);

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('bulkUploadResults');

        $results = session('bulkUploadResults');
        $this->assertEquals(1, $results['successful']); // First row should succeed
        $this->assertCount(1, $results['errors']); // Second row should fail
    }

    public function test_validates_coordinates_not_within_2nm_in_file()
    {
        // Create CSV with airports very close to each other (< 2nm apart)
        // Using coordinates that are approximately 0.5nm apart
        $csvContent = "identifier,name,location,country,country_code,lat,lon,magnetic_variance,altitude,size,longest_runway_length,longest_runway_width,longest_runway_surface,has_avgas,has_jetfuel\n"
            . "TEST1,Test Airport 1,Test Location 1,United States,US,-33.9469,18.6017,0,14,3,2500,75,ASPHALT,true,false\n"
            . 'TEST2,Test Airport 2,Test Location 2,United States,US,-33.9478,18.6017,0,173,4,3000,100,CONCRETE,false,true';

        $file = UploadedFile::fake()->createWithContent('airports.csv', $csvContent);

        // First visit the airports page to set the referrer
        $this->actingAs($this->user)->get('/admin/airports');

        $response = $this->actingAs($this->user)->post('/admin/airports/bulk-upload', [
            'file' => $file,
        ]);

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('bulkUploadResults');

        $results = session('bulkUploadResults');
        $this->assertEquals(1, $results['successful']); // First row should succeed
        $this->assertCount(1, $results['errors']); // Second row should fail
    }

    public function test_validates_runway_surface_enum_values()
    {
        // Create CSV with invalid runway surface
        $csvContent = "identifier,name,location,country,country_code,lat,lon,magnetic_variance,altitude,size,longest_runway_length,longest_runway_width,longest_runway_surface,has_avgas,has_jetfuel\n"
            . 'TEST1,Test Airport 1,Test Location 1,United States,US,-33.9469,18.6017,0,14,3,2500,75,INVALID_SURFACE,true,false';

        $file = UploadedFile::fake()->createWithContent('airports.csv', $csvContent);

        // First visit the airports page to set the referrer
        $this->actingAs($this->user)->get('/admin/airports');

        $response = $this->actingAs($this->user)->post('/admin/airports/bulk-upload', [
            'file' => $file,
        ]);

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('bulkUploadResults');

        $results = session('bulkUploadResults');
        $this->assertEquals(0, $results['successful']); // Should fail
        $this->assertCount(1, $results['errors']); // Should have one error
    }

    public function test_accepts_valid_runway_surface_enum_values()
    {
        // Create CSV with valid runway surfaces (testing case insensitivity)
        $csvContent = "identifier,name,location,country,country_code,lat,lon,magnetic_variance,altitude,size,longest_runway_length,longest_runway_width,longest_runway_surface,has_avgas,has_jetfuel\n"
            . "TEST1,Test Airport 1,Test Location 1,United States,US,-33.9469,18.6017,0,14,3,2500,75,ASPHALT,true,false\n"
            . "TEST2,Test Airport 2,Test Location 2,Canada,CA,43.6777,-79.6248,0,173,4,3000,100,concrete,false,true\n"
            . 'TEST3,Test Airport 3,Test Location 3,Australia,AU,-37.8136,144.9631,0,200,5,4000,150,Grass,true,true';

        $file = UploadedFile::fake()->createWithContent('airports.csv', $csvContent);

        // First visit the airports page to set the referrer
        $this->actingAs($this->user)->get('/admin/airports');

        $response = $this->actingAs($this->user)->post('/admin/airports/bulk-upload', [
            'file' => $file,
        ]);

        $response->assertRedirect('/admin/airports');
        $response->assertSessionHas('bulkUploadResults');

        $results = session('bulkUploadResults');
        $this->assertEquals(3, $results['successful']); // All should succeed
        $this->assertCount(0, $results['errors']); // No errors

        // Verify airports were created with correct runway surfaces
        $this->assertDatabaseHas('airports', [
            'identifier' => 'TEST1',
            'longest_runway_surface' => 'A',
        ]);
        $this->assertDatabaseHas('airports', [
            'identifier' => 'TEST2',
            'longest_runway_surface' => 'C',
        ]);
        $this->assertDatabaseHas('airports', [
            'identifier' => 'TEST3',
            'longest_runway_surface' => 'G',
        ]);
    }
}
