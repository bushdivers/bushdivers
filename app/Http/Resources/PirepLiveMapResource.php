<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PirepLiveMapResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'tour_id' => $this->tour_id,
            'current_lat' => $this->current_lat,
            'current_lon' => $this->current_lon,
            'current_heading' => $this->current_heading,
            'current_indicated_speed' => $this->current_indicated_speed,
            'current_altitude' => $this->current_altitude,

            'pilot' => $this->pilot ? $this->pilot->only(['id', 'discord_username', 'private_name', 'pilot_id']) : null,

            'arr_airport' => $this->arrAirport ? $this->arrAirport->only(['id', 'identifier', 'name', 'lat', 'lon']) : null,
            'dep_airport' => $this->depAirport ? $this->depAirport->only(['id', 'identifier', 'name', 'lat', 'lon']) : null,

            'rental' => $this->is_rental ? [
                'registration' => $this->rental->registration,
                'fleet' => $this->rental->fleet ? $this->rental->fleet->only(['id', 'name', 'type', 'manufacturer']) : null,
            ] : null,
            'aircraft' => !$this->is_rental && $this->aircraft ? [
                'registration' => $this->aircraft->registration,
                'fleet' => $this->aircraft->fleet ? $this->aircraft->fleet->only(['id', 'name', 'type', 'manufacturer']) : null,
            ] : null,

            'logs' => $this->logs ? $this->logs->map(fn ($log) => [
                'id' => $log->id,
                'lat' => $log->lat,
                'lon' => $log->lon,
            ]) : null
        ];
    }
}
