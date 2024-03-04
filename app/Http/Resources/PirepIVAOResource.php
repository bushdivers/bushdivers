<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PirepIVAOResource extends JsonResource
{
    public static $wrap = 'pilots';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $aircraft = !$this->is_rental ? $this->aircraft : $this->rental;

        return [
            //'time' => 0,
            'id' => $this->id,
            'userId' => $this->pilot->pilot_id,
            'callsign' => $aircraft->registration,

            //'serverId' => 0,
            //'softwareTypeId' => 'BushTracker',
            //'softwareVersion' => '1.0.0',

            'createdAt' => $this->created_at,
            'flightPlan' => [
                'id' => $this->id,
                'aircraftId' => $aircraft->fleet->type,
                'departureId' => $this->depAirport->identifier,
                'arrivalId' => $this->arrAirport->identifier,
                // Spec says aircraft block. LNM sourceode says aircraftId tag
                'aircraft' => [
                    'icaoCode' => $aircraft->fleet->type,
                    'model' => $aircraft->fleet->name,
                ],
                //'flightRules' => 'V',
                //'flightType' => '',
                //'peopleOnBoard' => 0,
                //'remarks' => '',
                //'route' => '',

                // time in seconds
                //'departureTime' => 0,
                //'actualDepartureTime' => 0,
            ],
            'pilotSession' => [
                'simulatorId' => 'MSFS'
            ],
            'lastTrack' => [
                'altitude' => $this->current_altitude,
                'groundSpeed' => $this->latestLog->ground_speed ?? 0,
                'heading' => $this->current_heading,
                'latitude' => $this->current_lat,
                'longitude' => $this->current_lon,
                'onGround' => false,
                //'state' => 'En Route',
                //'time' => 0, // Time since first track
                'timestamp' => $this->updated_at,
                //'transponder' => 1200,
                //'transponderMode' => '',
            ]
        ];
    }
}
