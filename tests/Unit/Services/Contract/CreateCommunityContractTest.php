<?php

namespace Tests\Unit\Services\Contract;

use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Services\Contracts\CreateCommunityContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateCommunityContractTest extends TestCase
{
    use RefreshDatabase;
    protected CreateCommunityContract $createCommunityContract;
    protected Model $communityJob;
    protected Model $communityJobContract;

    protected function setUp(): void
    {
        parent::setUp(); // TODO: Change the autogenerated stub
        $this->communityJob = CommunityJob::factory()->create();
        $this->communityJobContract = CommunityJobContract::factory()->create(['community_job_id' => $this->communityJob->id]);
        $this->createCommunityContract = app()->make(CreateCommunityContract::class);
        Airport::factory()->create(['identifier' => 'AYMN']);
        Airport::factory()->create(['identifier' => 'AYMR']);
    }

    /**
     * A basic unit test example.
     */
    public function test_contract_created(): void
    {
        $this->createCommunityContract->execute($this->communityJobContract);
        $this->assertDatabaseHas('contracts', ['community_job_contract_id' => $this->communityJobContract->id]);
    }
}