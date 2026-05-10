<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\Enums\CargoType;
use App\Models\User;
use App\Services\Airports\UpdateFuelAtAirport;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CreateFuelContract
{
    protected StoreContracts $storeContract;
    protected CalcContractValue $calcContractValue;

    protected UpdateFuelAtAirport $updateFuelAtAirport;

    public function __construct(
        StoreContracts $storeContract,
        CalcContractValue $calcContractValue,
        UpdateFuelAtAirport $updateFuelAtAirport
    ) {
        $this->storeContract = $storeContract;
        $this->calcContractValue = $calcContractValue;
        $this->updateFuelAtAirport = $updateFuelAtAirport;
    }
    public function execute(Airport $depAirport, Airport $arrAirport, int $qty, int $fuelType, int $weight, ?User $userId): void
    {
        try {
            // contract info
            $distance = $depAirport->distanceTo($arrAirport);
            $heading = $depAirport->bearingTo($arrAirport);

            $fuelString = $fuelType === 1 ? '100LL' : 'Jet Fuel';
            // cargo info
            $cargo = [
                'type' => CargoType::Cargo,
                'qty' => $weight,
                'name' => $qty.' gal '.$fuelString.' Fuel'
            ];

            $value = $this->calcContractValue->execute($cargo['type'], $cargo['qty'], $distance);

            //These figures should give generally continous step function at 100nm
            if ($weight > 10000) {
                $value = round(($value / 10) + 6700);
            } elseif ($weight > 3200) {
                $value = round(($value / 2) + 1750);
            }


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
                'is_fuel' => true,
                'fuel_qty' => $qty,
                'fuel_type' => $fuelType
            ]];
            $this->updateFuelAtAirport->execute($depAirport, $qty, $fuelType, 'decrement');
            $this->storeContract->execute($data, false, false, $userId);
        } catch (ModelNotFoundException $e) {
            throw new ModelNotFoundException();
        }
    }
}
