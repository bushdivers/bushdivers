<?php

namespace App\Services\Contracts;

use App\Models\Contract;
use App\Models\Enums\ContractType;
use Carbon\Carbon;

class GetContractsFromCriteria
{
    public function execute($icao): array
    {
//        $icao = $criteria['icao'];
//        $distance = $criteria['distance'];
//        $cargo = $criteria['cargo'];
//        $pax = $criteria['pax'];

//        $range = match ($distance) {
//            "Up to 50nm" => [0, 50],
//            "50nm-150nm" => [51, 150],
//            "150nm+" => [151, 5000]
//        };

        $paxContracts =  Contract::with('depAirport', 'arrAirport', 'cargo', 'cargo.currentAirport')
            ->where('dep_airport_id', $icao)
            ->where('is_available', true)
            ->where('expires_at', '>', Carbon::now())
//            ->whereBetween('distance', $range)
//            ->whereHas('cargo', function ($q) use($pax) {
//                $q->where('contract_type_id', ContractType::Passenger)
//                    ->where('cargo_qty', '<=', $pax);
//            })
//            ->orderBy('heading')
            ->get();

        $cargoContracts =  Contract::with('depAirport', 'arrAirport', 'cargo', 'cargo.currentAirport')
            ->where('dep_airport_id', $icao)
            ->where('is_available', true)
            ->where('expires_at', '>', Carbon::now())
            //->whereBetween('distance', $range)
//            ->whereHas('cargo', function ($q) use($cargo) {
//                $q->where('contract_type_id', ContractType::Cargo)
//                    ->where('cargo_qty', '<=', $cargo);
//            })
//            ->orderBy('heading')
            ->get();

        $contracts = $paxContracts->merge($cargoContracts);

        return $contracts->all();
    }
}
