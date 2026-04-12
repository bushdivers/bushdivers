<?php

namespace Tests\Feature\Admin;

use App\Models\Fleet;
use App\Models\Role;
use App\Models\Upload;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class LiveryUploadTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Fleet $fleet;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create()->refresh();
        $this->user->roles()->attach(Role::where('role', 'fleet_admin')->first());

        $this->fleet = Fleet::factory()->create();
    }

    public function test_can_create_livery_with_external_url()
    {
        $response = $this->actingAs($this->user)->post(
            route('admin.fleet.livery.store', $this->fleet->id),
            [
                'display_name' => 'My Livery',
                'author' => 'Pilot Pete',
                'sim_type' => ['fs20'],
                'url' => 'https://flightsim.to/file/12345/my-livery',
            ]
        );

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('uploads', [
            'uploadable_id' => $this->fleet->id,
            'uploadable_type' => Fleet::class,
            'display_name' => 'My Livery',
            'author' => 'Pilot Pete',
            'upload_type' => 'livery',
            'disk' => null,
            'url' => 'https://flightsim.to/file/12345/my-livery',
        ]);
    }

    public function test_can_create_livery_with_file_upload()
    {
        Storage::fake('s3');

        $file = UploadedFile::fake()->create('my-livery.zip', 1024, 'application/zip');

        $response = $this->actingAs($this->user)->post(
            route('admin.fleet.livery.store', $this->fleet->id),
            [
                'display_name' => 'Uploaded Livery',
                'author' => null,
                'sim_type' => ['fs24'],
                'uploaded_file' => $file,
            ]
        );

        $response->assertSessionHas('success');

        $upload = Upload::where('uploadable_id', $this->fleet->id)->first();
        $this->assertNotNull($upload);
        $this->assertEquals('Uploaded Livery', $upload->display_name);
        $this->assertEquals('s3', $upload->disk);
        $this->assertEquals(1024 * 1024, $upload->size);
        $this->assertEquals('livery', $upload->upload_type);
        $filename = Str::afterLast($upload->url, '/');
        Storage::disk('s3')->assertExists('liveries/' . $filename);
    }

    public function test_create_livery_requires_url_or_file()
    {
        $response = $this->actingAs($this->user)->post(
            route('admin.fleet.livery.store', $this->fleet->id),
            [
                'display_name' => 'My Livery',
            ]
        );

        $response->assertSessionHasErrors(['url', 'uploaded_file']);
    }

    public function test_create_livery_requires_valid_url()
    {
        $response = $this->actingAs($this->user)->post(
            route('admin.fleet.livery.store', $this->fleet->id),
            [
                'display_name' => 'My Livery',
                'url' => 'not-a-valid-url',
            ]
        );

        $response->assertSessionHasErrors('url');
    }

    public function test_can_update_livery_metadata()
    {
        $upload = $this->fleet->uploads()->create([
            'url' => 'https://flightsim.to/file/12345/livery',
            'display_name' => 'Old Name',
            'author' => null,
            'upload_type' => 'livery',
            'sim_type' => [],
            'size' => null,
        ]);

        $response = $this->actingAs($this->user)->post(
            route('admin.upload.update', $upload->id),
            [
                'display_name' => 'New Name',
                'author' => 'Jane Doe',
                'sim_type' => ['fs20', 'fs24'],
            ]
        );

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('uploads', [
            'id' => $upload->id,
            'display_name' => 'New Name',
            'author' => 'Jane Doe',
        ]);
    }

    public function test_update_livery_requires_display_name()
    {
        $upload = $this->fleet->uploads()->create([
            'url' => 'https://flightsim.to/file/12345/livery',
            'display_name' => 'Old Name',
            'upload_type' => 'livery',
            'sim_type' => [],
            'size' => null,
        ]);

        $response = $this->actingAs($this->user)->post(
            route('admin.upload.update', $upload->id),
            ['author' => 'Jane']
        );

        $response->assertSessionHasErrors('display_name');
    }

    public function test_unauthenticated_user_cannot_create_livery()
    {
        $response = $this->post(
            route('admin.fleet.livery.store', $this->fleet->id),
            ['display_name' => 'Livery', 'url' => 'https://flightsim.to/file/1/x']
        );

        $response->assertRedirect('/login');
    }
}
