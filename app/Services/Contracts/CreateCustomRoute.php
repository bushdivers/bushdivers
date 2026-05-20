<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\Enums\CargoType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CreateCustomRoute
{
    protected StoreContracts $storeContract;
    protected CalcContractValue $calcContractValue;

    public function __construct(
        StoreContracts $storeContract,
        CalcContractValue $calcContractValue
    ) {
        $this->storeContract = $storeContract;
        $this->calcContractValue = $calcContractValue;
    }

    public function execute(string $dep, string $arr, User $user, string $type = 'cargo')
    {
        try {
            $depAirport = Airport::where('identifier', $dep)->whereNull('user_id')->firstOrFail();
            $arrAirport = Airport::where('identifier', $arr)->whereNull('user_id')->firstOrFail();

            // contract info
            $distance = $depAirport->distanceTo($arrAirport);
            $heading = $depAirport->bearingTo($arrAirport);

            // cargo info
            $cargo = match ($type) {
                'passenger' => [
                    'type' => CargoType::Passenger,
                    'qty' => 1,
                    'name' => 'Passenger',
                ],
                default => [
                    'type' => CargoType::Cargo,
                    'qty' => 300,
                    'name' => 'Second hand goods',
                ],
            };

            $value = $this->calcContractValue->execute($cargo['type'], $cargo['qty'], $distance);

            // add contract
            $data = [[
                'departure' => $depAirport->identifier,
                'destination' => $arrAirport->identifier,
                'distance' => $distance,
                'heading' => $heading,
                'contract_value' => $value,
                'cargo' => $cargo['name'],
                'cargo_type' => $cargo['type'],
                'cargo_qty' => $cargo['qty'],
                'expires_at' => Carbon::now()->addDays(7),
                'is_fuel' => false
            ]];


            $this->storeContract->execute($data, false, true, $user);
        } catch (ModelNotFoundException $e) {
            throw new ModelNotFoundException();
        }

    }
}
