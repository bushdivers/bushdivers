<?php

namespace Tests\Feature\Dispatch;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\FuelType;
use App\Models\Fleet;
use App\Models\Pirep;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateDispatchTest extends TestCase
{
    use RefreshDatabase;

    protected Model $user;
    protected Model $aircraftOrigin;
    protected Model $aircraftDestination;

    protected Model $origin;
    protected Model $destination;
    protected Model $alternate;

    protected function cancelPirep(): void
    {
        $response = $this->actingAs($this->user)->post(route('dispatch.cancel'), ['pirep' => Pirep::where('user_id', $this->user->id)->orderBy('created_at', 'desc')->first()->id]); // Don't validate result
        $response->assertSessionHas('success');
    }

    protected function setUp(): void
    {
        parent::setUp();


        $this->origin = Airport::factory()->create(['identifier' => 'YSSY', 'is_hub' => false]);
        $this->destination = Airport::factory()->create(['identifier' => 'YMML', 'is_hub' => false]);

        $fleet = Fleet::factory()->create(['fuel_type' => FuelType::AVGAS, 'type' => 'AA01']);
        $this->aircraftOrigin = Aircraft::factory()->create(['fleet_id' => $fleet->id, 'registration' => 'VH-XYZ', 'fuel_onboard' => 0, 'current_airport_id' => $this->origin->identifier]);
        $fleet = Fleet::factory()->create(['fuel_type' => FuelType::JET, 'type' => 'AA02']);
        $this->aircraftDestination = Aircraft::factory()->create(['fleet_id' => $fleet->id, 'registration' => 'VH-ABC', 'fuel_onboard' => 0, 'current_airport_id' => $this->destination->identifier]);

        $this->user = User::factory()->create(['current_airport_id' => $this->origin->identifier]);
    }

    public function test_authentication_required()
    {
        $response = $this->post(route('dispatch.create'));
        $response->assertRedirectToRoute('login');
    }

    public function test_aircraft_location()
    {
        $body = [
            'aircraft' => $this->aircraftDestination->registration,
            'fuel' => 0,
            'fuel_price' => 1.00,
            'destination' => $this->destination->identifier,
            'is_empty' => true,
            'tour' => null,
        ];

        $response = $this->actingAs($this->user)->post(route('dispatch.create'), $body);
        $response->assertSessionHas('error');

        $body['aircraft'] = $this->aircraftOrigin->registration;
        $response = $this->actingAs($this->user)->post(route('dispatch.create'), $body);
        $response->assertSessionHas('success');
    }

    public function test_aircraft_owner()
    {
        $body = [
            'aircraft' => $this->aircraftOrigin->registration,
            'fuel' => 0,
            'fuel_price' => 1.00,
            'destination' => $this->destination->identifier,
            'is_empty' => true,
            'tour' => null,
        ];

        $this->aircraftOrigin->owner_id = User::factory()->create()->id;
        $this->aircraftOrigin->save();
        $response = $this->actingAs($this->user)->post(route('dispatch.create'), $body);
        $response->assertSessionHas('error');

        $this->aircraftOrigin->owner_id = $this->user->id;
        $this->aircraftOrigin->save();
        $response = $this->actingAs($this->user)->post(route('dispatch.create'), $body);
        $response->assertSessionHas('success');

        $this->cancelPirep();

        $this->aircraftOrigin->owner_id = 0;
        $this->aircraftOrigin->save();
        $response = $this->actingAs($this->user)->post(route('dispatch.create'), $body);
        $response->assertSessionHas('success');
    }

    public function test_avgas_refuel()
    {
        $body = [
            'aircraft' => $this->aircraftOrigin->registration,
            'fuel' => 100,
            'fuel_price' => 1.00,
            'destination' => $this->destination->identifier,
            'is_empty' => true,
            'tour' => null,
        ];

        $this->user->current_airport_id = $this->origin->identifier;
        $this->user->save();

        $this->origin->avgas_qty = 0;
        $this->origin->jetfuel_qty = 150;
        $this->origin->save();

        $response = $this->actingAs($this->user)->post(route('dispatch.create'), $body);
        $response->assertSessionHas('error');

        $this->origin->avgas_qty = 105;
        $this->origin->jetfuel_qty = 0;
        $this->origin->save();
        $response = $this->actingAs($this->user)->post(route('dispatch.create'), $body);
        $response->assertSessionHas('success');
    }

    public function test_jetfuel_refuel()
    {
        $body = [
            'aircraft' => $this->aircraftOrigin->registration,
            'fuel' => 100,
            'fuel_price' => 1.00,
            'destination' => $this->destination->identifier,
            'is_empty' => true,
            'tour' => null,
        ];

        $this->user->current_airport_id = $this->origin->identifier;
        $this->user->save();

        $this->aircraftOrigin->fleet->fuel_type = FuelType::JET;
        $this->aircraftOrigin->fleet->save();

        $this->origin->avgas_qty = 150;
        $this->origin->jetfuel_qty = 0;
        $this->origin->save();

        $response = $this->actingAs($this->user)->post(route('dispatch.create'), $body);
        $response->assertSessionHas('error');

        $this->origin->avgas_qty = 0;
        $this->origin->jetfuel_qty = 200;
        $this->origin->save();
        $response = $this->actingAs($this->user)->post(route('dispatch.create'), $body);

        $response->assertSessionHas('success');



    }



}
