<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PirepIVAOCollection extends ResourceCollection
{
    public static $wrap = 'pilots';

    public $collects = PirepIVAOResource::class;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
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
