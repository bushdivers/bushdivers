<?php

namespace App\Services;

use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Contract;
use App\Models\ContractCargo;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use App\Models\Enums\PirepState;
use App\Models\Enums\PirepStatus;
use App\Models\Enums\PointsType;
use App\Models\Enums\TransactionTypes;
use App\Models\Flight;
use App\Models\FlightLog;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Models\Point;
use App\Models\Rank;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PirepService
{
    public function calculatePoints($pirep)
    {
        // completed flight
        $this->addPointsEntry($pirep->id, PointsType::COMPLETED_FLIGHT_LABEL, PointsType::COMPLETED_FLIGHT);

        // hub
        $user = User::find($pirep->user_id);
        if ($pirep->departure_airport_id == $user->hub_id || $pirep->destination_airport_id == $user->hub_id) {
            $this->addPointsEntry($pirep->id, PointsType::HOME_HUB_LABEL, PointsType::HOME_HUB);
        }

        // time
        $hours = floor($pirep->flight_time / 60);
        $this->addPointsEntry($pirep->id, PointsType::ONE_HOUR_LABEL, PointsType::ONE_HOUR * $hours);

        // distance
        $distance = floor($pirep->distance / 50);
        $this->addPointsEntry($pirep->id, PointsType::FIFTY_MILES_LABEL, PointsType::FIFTY_MILES * $distance);

        // TODO: flaps

        // TODO: overspeed

        // landing rate
        $landing_rate = $this->calculateLandingRatePoints($pirep->landing_rate);
        if ($landing_rate['points'] > 0) {
            $this->addPointsEntry($pirep->id, $landing_rate['type'], $landing_rate['points']);
        }

        // TODO: exceed 250 under 10,000ft

        // TODO: time compression penalty
    }

    public function calculatePilotPay($pirep)
    {
        $user = User::find($pirep->user_id);
        $pay = 0.00;

        $pirepCargo = PirepCargo::where('pirep_id', $pirep->id)->get();
        foreach ($pirepCargo as $pc) {
            $cargo = ContractCargo::find($pc->contract_cargo_id);
            $contract = Contract::find($cargo->contract_id);
            if ($contract->is_completed) {
                $pay += $contract->contract_value;

                // update users balance
                $user->account_balance += $pay;
                $user->save();

                // add line to user account
                DB::table('user_accounts')->insert([
                    'user_id' => $user->id,
                    'type' => TransactionTypes::FlightPay,
                    'total' => $pay,
                    'flight_id' => $pirep->id
                ]);
            }
        }
    }

    public function calculateLandingRatePoints($landingRate): array
    {
        $points = 0;
        $type = '';
        switch (true) {
            case in_array($landingRate, range(-500,-600)):
                $points = PointsType::LANDING_RATE_M600_M500;
                $type = PointsType::LANDING_RATE_M600_M500_LABEL;
                break;
            case in_array($landingRate, range(-300,-499)):
                $points = PointsType::LANDING_RATE_M499_M300;
                $type = PointsType::LANDING_RATE_M499_M300_LABEL;
                break;
            case in_array($landingRate, range(-200,-299)):
                $points = PointsType::LANDING_RATE_M299_M200;
                $type = PointsType::LANDING_RATE_M299_M200_LABEL;
                break;
            case in_array($landingRate, range(-151,-199)):
                $points = PointsType::LANDING_RATE_M199_M151;
                $type = PointsType::LANDING_RATE_M199_M151_LABEL;
                break;
            case $landingRate == 150:
                $points = PointsType::LANDING_RATE_PERFECT;
                $type = PointsType::LANDING_RATE_PERFECT_LABEL;
                break;
            case in_array($landingRate, range(-100,-149)):
                $points = PointsType::LANDING_RATE_M149_M100;
                $type = PointsType::LANDING_RATE_M149_M100_LABEL;
                break;
            case in_array($landingRate, range(-99,300)):
                $points = PointsType::LANDING_RATE_M99_300;
                $type = PointsType::LANDING_RATE_M99_300_LABEL;
                break;
            case in_array($landingRate, range(301,500)):
                $points = PointsType::LANDING_RATE_301_500;
                $type = PointsType::LANDING_RATE_301_500_LABEL;
                break;
            case in_array($landingRate, range(501,800)):
                $points = PointsType::LANDING_RATE_501_800;
                $type = PointsType::LANDING_RATE_501_800_LABEL;
                break;
        }

        return ['points' => $points, 'type' => $type];
    }

    public function updatePirepTotalScore($pirep)
    {
        $points = Point::where('pirep_id', $pirep->id)->sum('points');
        $p = Pirep::find($pirep->id);
        $p->score = $points;
        $p->save();

        $user = User::find($pirep->user_id);
        $user->points += $points;
        $user->save();
    }

    protected function addPointsEntry(string $pirep_id, string $type, int $points)
    {
        $entry = new Point();
        $entry->pirep_id = $pirep_id;
        $entry->type_name = $type;
        $entry->points = $points;
        $entry->save();
    }

    public function findInactivePireps()
    {
        $dateToCompare = Carbon::now()->subHours(48);

        $pireps = Pirep::where('status', PirepState::DISPATCH)
            ->where('created_at', '<', $dateToCompare)
            ->get();

        return $pireps;
    }

    public function removeMultiplePireps($pireps)
    {
        $aircraftService = new AircraftService();
        if ($pireps->count() > 1) {
            foreach ($pireps as $pirep) {
                $aircraftService->updateAircraftState($pirep->aircraft_id, AircraftState::AVAILABLE);
                $this->removePirep($pirep->id);
            }
        } elseif ($pireps->count() == 1) {
            $aircraftService->updateAircraftState($pireps->aircraft_id, AircraftState::AVAILABLE);
            $this->removePirep($pireps->id);
        }

    }

    public function removePirep($pirepId)
    {
        Pirep::destroy($pirepId);
    }

    public function calculateTotalFlightDistance($pirep): float
    {
        $airportService = new AirportService();
        $distance = 0;
        $first = true;

        // find lat/lon for departure
        $dep = Airport::where('identifier', $pirep->departure_airport_id)->first();
        $startLat = $dep->lat;
        $startLon = $dep->lon;
        //get initial leg


        $lastLat = 0.00;
        $lastLon = 0.00;

        // find flight logs for pirep
        $logs = FlightLog::where('pirep_id', $pirep->id)->get();
        $i = 1;
        foreach ($logs as $log) {
            // loop through logs and tally up distance between each point
            if ($first) {
                $distance += $airportService->calculateDistanceBetweenPoints($startLat, $startLon, $log->lat, $log->lon);
                $first = false;
            } else {
                $distance += $airportService->calculateDistanceBetweenPoints($lastLat, $lastLon, $log->lat, $log->lon);
            }

            if ($i < $logs->count()) {
                $lastLat = $log->lat;
                $lastLon = $log->lon;
            }
            $i++;
        }

        return $distance;
    }
}
