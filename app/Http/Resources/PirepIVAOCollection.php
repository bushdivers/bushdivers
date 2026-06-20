<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PirepIVAOCollection extends ResourceCollection
{
    public static $wrap = 'pilots';

    public $collects = PirepIVAOResource::class;

    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'updatedAt' => now(),
            'clients' => [
                'pilots' => $this->collection,
                'atcs'=> [],
                'observers' => [],
            ],
            'servers' => [],
            'voiceServers' => [],
            'connections' => [],

        ];
    }
}
