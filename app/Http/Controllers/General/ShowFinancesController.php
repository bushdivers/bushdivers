<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Models\AccountLedger;
use App\Models\Aircraft;
use App\Models\AirlineFees;
use App\Models\Airport;
use App\Models\Enums\AircraftStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowFinancesController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $accounts = AccountLedger::with('pirep')->orderBy('created_at', 'desc')->paginate(15);
        $balance = AccountLedger::all();

        $largeAc = Aircraft::with(['fleet'])
            ->where('owner_id', 0)
            ->whereHas('fleet', function ($q) {
                $q->where('size', 'L');
            })
            ->where('status', AircraftStatus::ACTIVE)
            ->count();
        $smallAc = Aircraft::with(['fleet'])
            ->where('owner_id', 0)
            ->whereHas('fleet', function ($q) {
                $q->where('size', 'S');
            })
            ->where('status', AircraftStatus::ACTIVE)
            ->count();
        $medAc = Aircraft::with(['fleet'])
            ->where('owner_id', 0)
            ->whereHas('fleet', function ($q) {
                $q->where('size', 'M');
            })
            ->where('status', AircraftStatus::ACTIVE)
            ->count();

        $hubs = Airport::where('is_hub', true)->count();

        $fees = AirlineFees::all();
        $largeStorageFee = $fees->where('fee_name', 'Aircraft Parking - Large')->first();
        $medStorageFee = $fees->where('fee_name', 'Aircraft Parking - Medium')->first();
        $smallStorageFee = $fees->where('fee_name', 'Aircraft Parking - Small')->first();
        $largeRentalFee = $fees->where('fee_name', 'Aircraft Ownership - Large')->first();
        $medRentalFee = $fees->where('fee_name', 'Aircraft Ownership - Medium')->first();
        $smallRentalFee = $fees->where('fee_name', 'Aircraft Ownership - Small')->first();
        $hubRentalFee = $fees->where('fee_name', 'Hub Rental')->first();

        $largeStorage = $largeAc * $largeStorageFee->fee_amount;
        $medStorage = $medAc * $medStorageFee->fee_amount;
        $smallStorage = $smallAc * $smallStorageFee->fee_amount;

        $largeRental = $largeAc * $largeRentalFee->fee_amount;
        $medRental = $medAc * $medRentalFee->fee_amount;
        $smallRental = $smallAc * $smallRentalFee->fee_amount;

        $aircraftStorage = $largeStorage + $medStorage + $smallStorage;
        $aircraftOps = $largeRental + $medRental + $smallRental;
        $hubRental = $hubs * $hubRentalFee->fee_amount;

        return Inertia::render('General/CompanyFinances', [
            'accounts' => $accounts,
            'balance' => $balance->sum('total'),
            'aircraftStorage' => $aircraftStorage,
            'aircraftOps' => $aircraftOps,
            'hubs' => $hubRental
        ]);
    }
}
