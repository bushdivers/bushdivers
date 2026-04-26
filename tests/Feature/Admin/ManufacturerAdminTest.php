<?php

namespace Tests\Feature\Admin;

use App\Models\Fleet;
use App\Models\Manufacturer;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ManufacturerAdminTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create()->refresh();
        $this->user->roles()->attach(Role::where('role', 'fleet_admin')->first());
    }

    public function test_can_create_manufacturer_without_logo(): void
    {
        $response = $this->actingAs($this->user)->post(route('admin.manufacturers.store'), [
            'name' => 'Cessna',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('manufacturers', ['name' => 'Cessna']);
    }

    public function test_can_create_manufacturer_with_logo_upload(): void
    {
        Storage::fake('s3');

        $file = UploadedFile::fake()->image('cessna-logo.png');

        $response = $this->actingAs($this->user)->post(route('admin.manufacturers.store'), [
            'name' => 'Cessna',
            'uploaded_file' => $file,
        ]);

        $response->assertSessionHas('success');

        $manufacturer = Manufacturer::where('name', 'Cessna')->firstOrFail();
        $this->assertNotEmpty($manufacturer->logo_url);

        $filename = basename(parse_url($manufacturer->logo_url, PHP_URL_PATH));
        Storage::disk('s3')->assertExists('manufacturers/logos/' . $filename);
    }

    public function test_create_requires_name(): void
    {
        $response = $this->actingAs($this->user)->post(route('admin.manufacturers.store'), []);

        $response->assertSessionHasErrors('name');
    }

    public function test_create_name_must_be_unique(): void
    {
        Manufacturer::factory()->create(['name' => 'Cessna']);

        $response = $this->actingAs($this->user)->post(route('admin.manufacturers.store'), [
            'name' => 'Cessna',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_can_update_manufacturer_name(): void
    {
        $manufacturer = Manufacturer::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->user)->patch(
            route('admin.manufacturers.update', $manufacturer),
            ['name' => 'New Name']
        );

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('manufacturers', ['id' => $manufacturer->id, 'name' => 'New Name']);
    }

    public function test_can_update_manufacturer_with_new_logo(): void
    {
        Storage::fake('s3');

        $manufacturer = Manufacturer::factory()->create(['name' => 'Piper', 'logo_url' => '']);

        $file = UploadedFile::fake()->image('piper-logo.jpg');

        $response = $this->actingAs($this->user)->patch(
            route('admin.manufacturers.update', $manufacturer),
            ['name' => 'Piper', 'uploaded_file' => $file]
        );

        $response->assertSessionHas('success');

        $manufacturer->refresh();
        $this->assertNotEmpty($manufacturer->logo_url);

        $filename = basename(parse_url($manufacturer->logo_url, PHP_URL_PATH));
        Storage::disk('s3')->assertExists('manufacturers/logos/' . $filename);
    }

    public function test_update_without_new_file_preserves_existing_logo(): void
    {
        $manufacturer = Manufacturer::factory()->create([
            'name' => 'Beechcraft',
            'logo_url' => 'https://s3.example.com/manufacturers/logos/existing.png',
        ]);

        $this->actingAs($this->user)->patch(
            route('admin.manufacturers.update', $manufacturer),
            ['name' => 'Beechcraft Updated']
        );

        $manufacturer->refresh();
        $this->assertEquals('https://s3.example.com/manufacturers/logos/existing.png', $manufacturer->logo_url);
        $this->assertEquals('Beechcraft Updated', $manufacturer->name);
    }

    public function test_update_name_unique_ignores_self(): void
    {
        $manufacturer = Manufacturer::factory()->create(['name' => 'Cessna']);

        $response = $this->actingAs($this->user)->patch(
            route('admin.manufacturers.update', $manufacturer),
            ['name' => 'Cessna']
        );

        $response->assertSessionHas('success');
    }

    public function test_can_delete_unused_manufacturer(): void
    {
        $manufacturer = Manufacturer::factory()->create();

        $response = $this->actingAs($this->user)->delete(
            route('admin.manufacturers.destroy', $manufacturer)
        );

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('manufacturers', ['id' => $manufacturer->id]);
    }

    public function test_cannot_delete_manufacturer_in_use(): void
    {
        $manufacturer = Manufacturer::factory()->create();
        Fleet::factory()->create(['manufacturer_id' => $manufacturer->id]);

        $response = $this->actingAs($this->user)->delete(
            route('admin.manufacturers.destroy', $manufacturer)
        );

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('manufacturers', ['id' => $manufacturer->id]);
    }

    public function test_unauthenticated_cannot_access_manufacturer_routes(): void
    {
        $manufacturer = Manufacturer::factory()->create();

        $this->post(route('admin.manufacturers.store'), ['name' => 'Test'])->assertRedirect('/login');
        $this->patch(route('admin.manufacturers.update', $manufacturer), ['name' => 'Test'])->assertRedirect('/login');
        $this->delete(route('admin.manufacturers.destroy', $manufacturer))->assertRedirect('/login');
    }
}
