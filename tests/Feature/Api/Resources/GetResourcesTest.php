<?php

namespace Tests\Feature\Api\Resources;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class GetResourcesTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_resources_returned()
    {
        DB::table('resource_categories')->insert([
            'id' => 1,
            'category' => 'Misc'
        ]);
        DB::table('resources')->insert([
            ['category_id' => 1, 'title' => 'Test', 'url' => 'www.test.com'],
            ['category_id' => 1, 'title' => 'Test2', 'url' => 'www.test2.com']
        ]);

        $response = $this->getJson('/api/resources');
        $response->assertStatus(200);
        $response->assertJsonCount(2, 'resources');
    }

    public function test_resources_returns_empty_successfully()
    {
        $response = $this->getJson('/api/resources');
        $response->assertStatus(200);
        $response->assertJsonCount(0, 'resources');
    }
}
