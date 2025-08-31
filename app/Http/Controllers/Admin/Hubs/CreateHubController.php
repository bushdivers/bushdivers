<?php

namespace App\Http\Controllers\Admin\Hubs;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Fleet;
use App\Services\Aircraft\GenerateAircraftDetails;
use App\Services\Airports\CalcCostOfHub;
use App\Services\Airports\CalcDistanceBetweenPoints;
use App\Services\Contracts\GenerateContractDetails;
use App\Services\Contracts\StoreContracts;
use App\Services\Finance\AddAirlineTransaction;
use App\Services\Finance\GetAirlineBalance;
use Illuminate\Http\Request;

class CreateHubController extends Controller
{
    protected GenerateAircraftDetails $generateAircraftDetails;
    protected GenerateContractDetails $generateContractDetails;
    protected StoreContracts $storeContracts;
    protected AddAirlineTransaction $addAirlineTransaction;
    protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints;
    protected CalcCostOfHub $calcCostOfHub;
    protected GetAirlineBalance $getAirlineBalance;
    public function __construct(
        GenerateAircraftDetails $generateAircraftDetails,
        GenerateContractDetails $generateContractDetails,
        StoreContracts $storeContracts,
        AddAirlineTransaction $addAirlineTransaction,
        CalcDistanceBetweenPoints $calcDistanceBetweenPoints,
        CalcCostOfHub $calcCostOfHub,
        GetAirlineBalance $getAirlineBalance
    )
    {
        $this->generateAircraftDetails = $generateAircraftDetails;
        $this->generateContractDetails = $generateContractDetails;
        $this->storeContracts = $storeContracts;
        $this->addAirlineTransaction = $addAirlineTransaction;
        $this->calcDistanceBetweenPoints = $calcDistanceBetweenPoints;
        $this->calcCostOfHub = $calcCostOfHub;
        $this->getAirlineBalance = $getAirlineBalance;
    }

    public function __invoke(Request $request): \Illuminate\Http\RedirectResponse
    {
        // hubs must be base only
        $existingMission = CommunityJob::where('is_completed', 0)->where('is_published', 1)->count();
        $hubInProgress = Airport::where('hub_in_progress', 1)->count();
        if ($existingMission > 0 || $hubInProgress > 0) {
            return redirect()->back()->with(['error' => 'Mission/Hub already published.']);
        }
        // set airport as hub and in progress
        $airport = Airport::base()->where('identifier', $request->identifier)->first();

        $cost = $this->calcCostOfHub->execute($request->aircraft);
        $balance = $this->getAirlineBalance->execute();
        if ($balance < $cost) {
            return redirect()->back()->with('error', 'Insufficient funds');
        }

        $airport->is_hub = true;
        $airport->hub_in_progress = true;
        $airport->save();

        $allAirports = Airport::base()->inRangeOf($airport, 100, 500)->get();
        // create aircraft
        if ($request->aircraft) {
            foreach ($request->aircraft as $aircraft) {
                $i = 1;
                while ($i <= $aircraft['qty']) {
                    $acAirport = $allAirports->where('size', '>=', 3)->random(1);
                    $fleet = Fleet::find($aircraft['fleet_id']);
                    $this->generateAircraftDetails->execute($fleet, $acAirport[0], $acAirport[0]->country_code, true, $airport->identifier);
                    $i++;
                }
            }
            $createdAC = Aircraft::where('hub_id', $airport->identifier)->where('is_ferry', true)->get();
            foreach ($createdAC as $ac) {
                $currentLocation = Airport::where('identifier', $ac->current_airport_id)->first();
                $distance = $this->calcDistanceBetweenPoints->execute($currentLocation->lat, $currentLocation->lon, $airport->lat, $airport->lon);
                $ac->ferry_distance = $distance;
                $ac->save();
                $this->addAirlineTransaction->execute(AirlineTransactionTypes::GeneralExpenditure, $ac->sale_price, 'AC Purchase '.$ac->registration, null, 'debit');
            }
        }

        // create contracts
        // building materials 30000
        $originAirport = $allAirports->where('size', '>=', 3)->random(1);
        $materialCargo = ['name' => 'Building Materials - '.$airport->identifier, 'type' => 1, 'qty' => 30000];
        $materialContract = $this->generateContractDetails->execute($originAirport[0], $airport, $materialCargo);
        $this->storeContracts->execute([$materialContract], false, false, null, 5, $airport->identifier, true);
        $this->addAirlineTransaction->execute(AirlineTransactionTypes::GeneralExpenditure, 60000, 'Hub Building Materials '.$airport->identifier, null, 'debit');

        // supplies 15000
        $originAirport = $allAirports->where('size', '>=', 3)->random(1);
        $supplyCargo = ['name' => 'Supplies - '.$airport->identifier, 'type' => 1, 'qty' => 15000];
        $supplyContract = $this->generateContractDetails->execute($originAirport[0], $airport, $supplyCargo);
        $this->storeContracts->execute([$supplyContract], false, false, null, 5, $airport->identifier, true);
        $this->addAirlineTransaction->execute(AirlineTransactionTypes::GeneralExpenditure, 30000, 'Hub Supplies '.$airport->identifier, null, 'debit');
        // contractors 10
        $originAirport = $allAirports->where('size', '>=', 3)->random(1);
        $contractorCargo = ['name' => 'Contractors - '.$airport->identifier, 'type' => 2, 'qty' => 10];
        $contractorContract = $this->generateContractDetails->execute($originAirport[0], $airport, $contractorCargo);
        $this->storeContracts->execute([$contractorContract], false, false, null, 5, $airport->identifier, true);
        $this->addAirlineTransaction->execute(AirlineTransactionTypes::GeneralExpenditure, 30000, 'Hub Contractors '.$airport->identifier, null, 'debit');
        // staff 3
        $originAirport = $allAirports->where('size', '>=', 3)->random(1);
        $staffCargo = ['name' => 'Hub Staff - '.$airport->identifier, 'type' => 2, 'qty' => 3];
        $staffContract = $this->generateContractDetails->execute($originAirport[0], $airport, $staffCargo);
        $this->storeContracts->execute([$staffContract], false, false, null, 5, $airport->identifier, true);

        return redirect()->back()->with('success', 'Hub created successfully');
    }
}
