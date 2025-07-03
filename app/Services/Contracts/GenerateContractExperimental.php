<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use Illuminate\Support\Facades\Http;

class GenerateContractExperimental
{
    public function execute(Airport $departureAirport, Airport $destinationAirport, string $cargoType, int $maxWeight, string $size)
    {
        $key = config('services.googleai.key');
        $prompt = $this->getPrompt($departureAirport, $destinationAirport, $cargoType, $maxWeight, $size);

        $aiResponse = Http::post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $key,
            [
                'contents' => [
                    'parts' => [
                        'text' => $prompt
                    ]
                ],
                'generationConfig' => [
                    'thinkingConfig' => [
                        'thinkingBudget' => 0
                    ]
                ]
            ]
        );
        // $encoded = json_encode($aiResponse->json());
        return $aiResponse->json();
    }

    private function getPrompt(Airport $departureAirport, Airport $destinationAirport, string $cargoType, int $maxWeight, string $size)
    {
        $text = 'I am a cargo Pilot who flies for a small cargo and passenger operator in various locations. You are a dispatcher for this operator responsible for finding jobs/contracts to fly. 
                I will provide some parameters: maximum cargo weight, the type of cargo (cargo or passenger), aircraft size, and the departure airport and arrival airport. with this information I want you to create a job for my to fly in the role of a dispatcher  with the following information: 

                * Details of the passengers or cargo, quantities and weights (in lbs) specific to the region with the aircraft size in mind.
                * Total cargo weight or number of passengers, make sure to stay below the maximum weight
                * A summary description/brief of the flight, scenario, destination, and cargo I will be carrying

                I want you to return the information the following JSON structure:

                {
                "summaryDescription": string,
                "destinationName": string,
                "destinationICAO": string
                "cargoType": string (cargo or passenger)
                "cargoDetails": [
                {
                "cargoDescription": string,
                "cargoWeight": number
                "cargoQty": number
                }
                ],
                "totalCargoWeight": number
                }

                * Departure: ' . $departureAirport->name . ' ' . $departureAirport->identifier . '
                * Destination: ' . $destinationAirport->name . ' ' . $destinationAirport->identifier . '
                * Cargo Type: ' . $cargoType . '
                * Max weight: ' . $maxWeight . ' lbs 
                * Aircraft Size: ' . $size . '';

        return $text;
    }
}