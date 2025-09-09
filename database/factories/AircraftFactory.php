<?php

namespace Database\Factories;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Fleet;
use Illuminate\Database\Eloquent\Factories\Factory;

class AircraftFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Aircraft::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'current_airport_id' => fn() => Airport::factory()->create(['name' => 'Factory Airport', 'is_hub' => true]),
            'registration' => 'P2-BDA',
            'fuel_onboard' => 26.8,
            'state' => 1,
            'status' => 1,
            'hub_id' => function (array $attr) {
                $ap = Airport::find($attr['current_airport_id']);
                return ($ap && $ap->is_hub) ? $ap : Airport::factory()->create(['name' => 'Factory Hub', 'is_hub' => true]);
            },
            'flight_time_mins' => 0,
            'fleet_id' => Fleet::factory()
        ];
    }

    public function atAirport(Airport $airport): static
    {
        return $this->state(fn() => [
            'current_airport_id' => $airport->id,
            'hub_id' => $airport->id,
        ]);
    }

    public function hub(Airport $airport): static
    {
        return $this->state(fn() => [
            'hub_id' => $airport->id,
        ]);
    }
}
