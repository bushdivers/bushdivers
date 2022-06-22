<?php

namespace Tests\Unit\Commands;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GenerateUsedAircraftTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_runs_successfully()
    {
        $this->artisan('generate:aircraft')->assertSuccessful();
    }
}
