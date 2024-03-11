<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\Enums\ContractType;
use App\Services\Airports\CalcBearingBetweenPoints;
use App\Services\Airports\CalcDistanceBetweenPoints;
use App\Services\Airports\UpdateFuelAtAirport;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CreateFuelContract
{
    protected StoreContracts $storeContract;
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;
    protected CalcBearingBetweenPoints $calcBearingBetweenPoints;
    protected CalcContractValue $calcContractValue;

    protected UpdateFuelAtAirport $updateFuelAtAirport;

    public function __construct(
        StoreContracts $storeContract,
        CalcDistanceBetweenPoints $calcDistanceBetweenPoints,
        CalcBearingBetweenPoints $calcBearingBetweenPoints,
        CalcContractValue $calcContractValue,
        UpdateFuelAtAirport $updateFuelAtAirport
    )
    {
        $this->storeContract = $storeContract;
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
        $this->calcBearingBetweenPoints = $calcBearingBetweenPoints;
        $this->calcContractValue = $calcContractValue;
        $this->updateFuelAtAirport = $updateFuelAtAirport;
    }
    public function execute(string $departure, string $destination, int $qty, int $fuelType, int $weight, $userId): void
    {
        try {
            $depAirport = Airport::where('identifier', $departure)->firstOrFail();
            $arrAirport = Airport::where('identifier', $destination)->firstOrFail();

            // contract info
            $distance = $this->calcDistanceBetweenPoints->execute($depAirport->lat, $depAirport->lon, $arrAirport->lat, $arrAirport->lon);
            $heading = $this->calcBearingBetweenPoints->execute($depAirport->lat, $depAirport->lon, $arrAirport->lat, $arrAirport->lon, $depAirport->magnetic_variance);

            $fuelString = $fuelType === 1 ? '100LL' : 'Jet Fuel';
            // cargo info
            $cargo = [
                'type' => ContractType::Cargo,
                'qty' => $weight,
                'name' => $qty.' gal '.$fuelString.' Fuel'
            ];

            $value = $this->calcContractValue->execute($cargo['type'], $cargo['qty'], $distance);
            if ($weight > 3200) {
                $value = round(round($value / 2) + 2000);
            }
            if ($weight > 10000) {
                $value = round(round($value / 10) + 4000);
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
            $this->updateFuelAtAirport->execute($departure, $qty, $fuelType, 'decrement');
            $this->storeContract->execute($data, false, false, $userId);
        } catch (ModelNotFoundException $e) {
            throw new ModelNotFoundException();
        }
    }
}
