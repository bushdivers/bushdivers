<?php

namespace Tests\Unit\Services\Aircraft;

use App\Services\Aircraft\FindAvailableRegistration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FindAvailableRegistrationTest extends TestCase
{
    use RefreshDatabase;
    protected FindAvailableRegistration $findAvailableRegistration;

    protected function setUp(): void
    {
        parent::setUp(); // TODO: Change the autogenerated stub
        $this->findAvailableRegistration = app()->make(FindAvailableRegistration::class);
    }

    /**
     * A basic unit test example.
     */
    public function test_PNG_Registration_Generated(): void
    {
        $reg = $this->findAvailableRegistration->execute('PG');
        $this->assertStringContainsString('P2', $reg);
    }

    public function test_PNG_ID_Registration_Generated(): void
    {
        $reg = $this->findAvailableRegistration->execute('ID');
        $this->assertStringContainsString('P2', $reg);
    }

    public function test_Nbased_Registration_Generated(): void
    {
        $reg = $this->findAvailableRegistration->execute('GB');
        $this->assertStringContainsString('N', $reg);
    }
}