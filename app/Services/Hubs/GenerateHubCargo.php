<?php

namespace App\Services\Hubs;

use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Models\Enums\CargoType;

class GenerateHubCargo
{
    /**
     * Seed the standard hub cargo legs as CommunityJobContract draft records
     * so admins can review and customise them before publishing.
     */
    public function execute(CommunityJob $mission, Airport $hub): void
    {
        $allAirports = Airport::base()->inRangeOf($hub, 100, 500)->get();
        $largeAirports = $allAirports->where('size', '>=', 3);

        $legs = [
            [
                'cargo'      => 'Building Materials - '.$hub->identifier,
                'cargo_type' => CargoType::Cargo,
                'payload'    => 30000,
            ],
            [
                'cargo'      => 'Supplies - '.$hub->identifier,
                'cargo_type' => CargoType::Cargo,
                'payload'    => 15000,
            ],
            [
                'cargo'      => 'Contractors - '.$hub->identifier,
                'cargo_type' => CargoType::Passenger,
                'pax'        => 10,
            ],
            [
                'cargo'      => 'Hub Staff - '.$hub->identifier,
                'cargo_type' => CargoType::Passenger,
                'pax'        => 3,
            ],
        ];

        foreach ($legs as $leg) {
            $origin = $largeAirports->random(1)->first();

            $job = new CommunityJobContract();
            $job->community_job_id = $mission->id;
            $job->dep_airport_id = $origin->id;
            $job->arr_airport_id = $hub->id;
            $job->cargo = $leg['cargo'];
            $job->cargo_type = $leg['cargo_type'];

            $job->is_recurring = false;

            if ($leg['cargo_type'] === CargoType::Cargo) {
                $job->forceFill([
                    'payload'           => $leg['payload'],
                    'remaining_payload' => $leg['payload'],
                ]);
            } else {
                $job->forceFill([
                    'pax'           => $leg['pax'],
                    'remaining_pax' => $leg['pax'],
                ]);
            }

            $job->save();
        }
    }
}
