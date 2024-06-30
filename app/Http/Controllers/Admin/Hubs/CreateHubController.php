<?php

namespace App\Http\Controllers\Admin\Hubs;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\AirlineTransactionTypes;
use App\Models\Fleet;
use App\Services\Aircraft\GenerateAircraftDetails;
use App\Services\Airports\FindAirportsWithinDistance;
use App\Services\Contracts\GenerateContractDetails;
use App\Services\Contracts\StoreContracts;
use App\Services\Finance\AddAirlineTransaction;
use Illuminate\Http\Request;

class CreateHubController extends Controller
{
    protected FindAirportsWithinDistance $findAirportsWithinDistance;
    protected GenerateAircraftDetails $generateAircraftDetails;
    protected GenerateContractDetails $generateContractDetails;
    protected StoreContracts $storeContracts;
    protected AddAirlineTransaction $addAirlineTransaction;
    public function __construct(FindAirportsWithinDistance $findAirportsWithinDistance, GenerateAircraftDetails $generateAircraftDetails, GenerateContractDetails $generateContractDetails, StoreContracts $storeContracts, AddAirlineTransaction $addAirlineTransaction)
    {
        $this->findAirportsWithinDistance = $findAirportsWithinDistance;
        $this->generateAircraftDetails = $generateAircraftDetails;
        $this->generateContractDetails = $generateContractDetails;
        $this->storeContracts = $storeContracts;
        $this->addAirlineTransaction = $addAirlineTransaction;
    }

    public function __invoke(Request $request): \Illuminate\Http\RedirectResponse
    {
        // set airport as hub and in progress
        $airport = Airport::where('identifier', $request->identifier)->first();
        $airport->is_hub = true;
        $airport->hub_in_progress = true;
        $airport->save();

        $allAirports =  $this->findAirportsWithinDistance->execute($airport, 100, 500);
        // create aircraft
        foreach ($request->aircraft as $aircraft) {
            $i = 1;
            while ($i <= $aircraft['qty']) {
                $acAirport = $allAirports->where('size', '>=', 3)->random(1);
                $fleet = Fleet::find($aircraft['fleet_id']);
                $this->generateAircraftDetails->execute($fleet, $acAirport[0], $acAirport[0]->country, true, $airport->identifier);
                $i++;
            }
        }

        // create ferry
        $createdAC = Aircraft::where('hub_id', $airport->identifier)->where('is_ferry', true)->get();
        foreach ($createdAC as $ac) {
            $this->addAirlineTransaction->execute(AirlineTransactionTypes::GeneralExpenditure, -$ac->sale_price, 'AC Purchase '.$ac->registration, null, 'debit');
        }

        // create contracts
        // building materials 30000
        $originAirport = $allAirports->where('size', '>=', 3)->random(1);
        $materialCargo = ['name' => 'Building Materials - '.$airport->identifier, 'type' => 1, 'qty' => 30000];
        $materialContract = $this->generateContractDetails->execute($originAirport[0], $airport, $materialCargo);
        $this->storeContracts->execute([$materialContract], true, false, null, 5, $airport->identifier, null, true);
        $this->addAirlineTransaction->execute(AirlineTransactionTypes::GeneralExpenditure, -60000, 'Hub Building Materials '.$airport->identifier, null, 'debit');

        // supplies 15000
        $originAirport = $allAirports->where('size', '>=', 3)->random(1);
        $supplyCargo = ['name' => 'Supplies - '.$airport->identifier, 'type' => 1, 'qty' => 15000];
        $supplyContract = $this->generateContractDetails->execute($originAirport[0], $airport, $supplyCargo);
        $this->storeContracts->execute([$supplyContract], true, false, null, 5, $airport->identifier, null, true);
        $this->addAirlineTransaction->execute(AirlineTransactionTypes::GeneralExpenditure, -30000, 'Hub Supplies '.$airport->identifier, null, 'debit');
        // contractors 10
        $originAirport = $allAirports->where('size', '>=', 3)->random(1);
        $contractorCargo = ['name' => 'Contractors - '.$airport->identifier, 'type' => 2, 'qty' => 10];
        $contractorContract = $this->generateContractDetails->execute($originAirport[0], $airport, $contractorCargo);
        $this->storeContracts->execute([$contractorContract], true, false, null, 5, $airport->identifier, null, true);
        $this->addAirlineTransaction->execute(AirlineTransactionTypes::GeneralExpenditure, -30000, 'Hub Contractors '.$airport->identifier, null, 'debit');
        // staff 3
        $originAirport = $allAirports->where('size', '>=', 3)->random(1);
        $staffCargo = ['name' => 'Hub Staff - '.$airport->identifier, 'type' => 2, 'qty' => 3];
        $staffContract = $this->generateContractDetails->execute($originAirport[0], $airport, $staffCargo);
        $this->storeContracts->execute([$staffContract], true, false, null, 5, $airport->identifier, null, true);

        return redirect()->back()->with('success', 'Hub created successfully');
    }
}
