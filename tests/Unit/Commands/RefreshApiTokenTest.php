<?php

namespace Tests\Unit\Commands;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RefreshApiTokenTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_runs_successfully()
    {
        $user = User::factory()->create([
            'api_token' => 'dasdasdasdasdasdadas'
        ]);
        $this->artisan('token:refresh', ['user' => $user->id])->assertSuccessful();
        $user->refresh();
        $this->assertNotEquals('dasdasdasdasdasdadas', $user->api_token);
    }


}
