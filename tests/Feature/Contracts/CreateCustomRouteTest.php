<?php

namespace Tests\Feature\Contracts;

use App\Models\Airport;
use App\Models\Contract;
use App\Models\Enums\ContractType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateCustomRouteTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Airport $dep;
    protected Airport $arr;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->dep = Airport::factory()->create(['identifier' => 'AYMR']);
        $this->arr = Airport::factory()->create(['identifier' => 'AYMN']);
    }

    public function test_creates_custom_contract_successfully(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('contracts.custom'), [
                'departure' => 'AYMR',
                'arrival' => 'AYMN',
            ]);

        $response->assertRedirect()->assertSessionHas('success');
        $this->assertDatabaseHas('contracts', [
            'user_id' => $this->user->id,
            'is_custom' => true,
        ]);
    }

    public function test_rejects_same_departure_and_arrival(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('contracts.custom'), [
                'departure' => 'AYMR',
                'arrival' => 'AYMR',
            ]);

        $response->assertRedirect()->assertSessionHas('error');
        $this->assertDatabaseCount('contracts', 0);
    }

    public function test_rejects_duplicate_outstanding_custom_contract(): void
    {
        Contract::factory()->create([
            'user_id' => $this->user->id,
            'dep_airport_id' => $this->dep->id,
            'arr_airport_id' => $this->arr->id,
            'is_custom' => true,
            'is_completed' => false,
            'contract_type_id' => ContractType::General,
        ]);

        $response = $this->actingAs($this->user)
            ->post(route('contracts.custom'), [
                'departure' => 'AYMR',
                'arrival' => 'AYMN',
            ]);

        $response->assertRedirect()->assertSessionHas('error');
        $this->assertDatabaseCount('contracts', 1);
    }

    public function test_rejects_unknown_airport(): void
    {
        $response = $this->actingAs($this->user)
            ->post(route('contracts.custom'), [
                'departure' => 'XXXX',
                'arrival' => 'YYYY',
            ]);

        $response->assertRedirect()->assertSessionHas('error');
        $this->assertDatabaseCount('contracts', 0);
    }
}
